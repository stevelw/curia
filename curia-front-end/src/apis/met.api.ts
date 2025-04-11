import axios from "axios";
import Artefact from "../types/Artefact.interface";

export const name = "MET API";
export const slug = "met";

const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";
const MAX_RESULTS_LIMIT = 100;

type CollectionObjectId = number;

interface FetchCollectionObjectResponse {
  objectID: CollectionObjectId;
  title: string;
}

interface SearchResponse {
  objectIDs: CollectionObjectId[];
}

function fetchObject(
  collectionObjectId: CollectionObjectId,
): Promise<Artefact> {
  return axios
    .get<FetchCollectionObjectResponse>(
      `${BASE_URL}/objects/${collectionObjectId}`,
    )
    .then(({ data: collectionObject }) => {
      const artefact: Artefact = {
        localId: slug + collectionObjectId,
        title: collectionObject.title,
        apiSource: name,
      };
      return artefact;
    })
    .catch(() => {
      throw new Error("Error in MET API");
    });
}

export function search(searchTerm: string): Promise<Artefact[]> {
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
