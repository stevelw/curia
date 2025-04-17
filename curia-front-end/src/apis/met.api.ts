import axios from "axios";
import { Api, Artefact } from "./api.class";

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

async function fetchObject(
  collectionObjectId: CollectionObjectId,
): Promise<Artefact> {
  return axios
    .get<FetchCollectionObjectResponse>(
      `${BASE_URL}/objects/${collectionObjectId}`,
    )
    .then(
      ({
        data: {
          accessionNumber,
          medium,
          title,
          objectDate,
          artistDisplayName,
          primaryImageSmall,
          primaryImage,
          additionalImages,
          department,
          culture,
        },
      }) => {
        const artefact: Artefact = {
          localId: slug + collectionObjectId,
          accessionNumber,
          objectType: medium,
          title,
          objectDate,
          maker: artistDisplayName,
          images: {
            primaryThumbnailUrl: primaryImageSmall,
            primaryImage: primaryImage,
            additionalImages: additionalImages,
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

async function search(searchTerm: string): Promise<Artefact[]> {
  return axios
    .get<SearchResponse>(`${BASE_URL}/search`, {
      params: { q: searchTerm },
    })
    .then(({ data: { objectIDs: collectionObjectIds } }) => {
      return Promise.all(
        collectionObjectIds
          .slice(0, MAX_RESULTS_LIMIT)
          .map((collectionObjectId) => fetchObject(collectionObjectId)),
      );
    })
    .catch((err) => {
      throw new Error(`MET: ${err}`);
    });
}

const metApi = new Api(name, search);

export { metApi, Artefact };
