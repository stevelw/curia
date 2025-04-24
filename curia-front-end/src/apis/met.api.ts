import axios from "axios";
import {
  Api,
  Artefact,
  SearchFnReturn,
  LocalId,
  SortOptions,
} from "./api.class";

const name = "MET API";
const slug = "met";

const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";
const MAX_RESULTS_LIMIT = 100;

type CollectionObjectId = number;

interface FetchCollectionObjectResponse {
  objectID: CollectionObjectId;
  title: string;
  accessionNumber: string;
  accessionYear: string;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  department: string;
  objectName: string;
  culture: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistBeginDate: string;
  artistEndDate: string;
  objectDate: string;
  objectBeginDate: number;
  objectEndDate: number;
  medium: string;
  city: string;
  state: string;
  county: string;
  country: string;
  region: string;
  subregion: string;
  locale: string;
  classification: string;
  repository: string;
  objectURL: string;
  GalleryNumber: string;
}

interface SearchResponse {
  objectIDs: CollectionObjectId[];
}

async function fetch(this: Api, localId: LocalId): Promise<Artefact> {
  if (!this.isHandled(localId)) {
    throw new Error("Incorrect API for localId");
  }
  const remoteId = this.remoteIdFrom(localId);
  return axios
    .get<FetchCollectionObjectResponse>(`${BASE_URL}/objects/${remoteId}`)
    .then(
      ({
        data: {
          objectID,
          accessionNumber,
          medium,
          title,
          objectDate,
          artistDisplayName,
          primaryImageSmall,
          primaryImage,
          department,
          culture,
        },
      }) => {
        const artefact: Artefact = {
          localId: this.localIdFrom(objectID.toString()),
          accessionNumber,
          objectType: medium,
          title,
          objectDate,
          maker: artistDisplayName,
          images: {
            primaryThumbnailUrl: primaryImageSmall,
            primaryImage: primaryImage,
          },
          currentLocation: department + " - The Metropolitan Museum of Art",
          provenance: culture,
          apiSource: name,
        };
        return artefact;
      },
    )
    .catch(() => {
      throw new Error("Error in MET API");
    });
}

async function search(
  this: Api,
  searchTerm: string,
  maxResults: number,
  sortBy: SortOptions,
): Promise<SearchFnReturn> {
  return axios
    .get<SearchResponse>(`${BASE_URL}/search`, {
      params: { q: searchTerm },
    })
    .then(({ data: { objectIDs: collectionObjectIds } }) => {
      return Promise.all(
        collectionObjectIds
          .slice(0, MAX_RESULTS_LIMIT)
          .map((collectionObjectId) =>
            this.fetch(this.localIdFrom(collectionObjectId.toString())),
          ),
      );
    })
    .then((artefacts) => {
      const filteredAndSortedResults = artefacts
        .filter((artefact) => !!artefact.maker)
        .sort((a, b) => {
          if (a.maker < b.maker) return -1;
          if (a.maker > b.maker) return 1;
          return 0;
        });
      const totalResultsAvailable = filteredAndSortedResults.length;
      const results = filteredAndSortedResults.slice(0, maxResults);
      return { totalResultsAvailable, results };
    })
    .catch((err) => {
      throw new Error(`MET: ${err}`);
    });
}

const metApi = new Api(name, slug, fetch, search);

export { metApi, SearchFnReturn };
