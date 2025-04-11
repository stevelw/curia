import axios from "axios";
import { Artefact } from "./aggregated.api";

export const name = "MET API";

const baseUrl = "https://collectionapi.metmuseum.org/public/collection/v1";

type CollectionObjectId = number;

interface SearchResponse {
  objectIDs: CollectionObjectId[];
}

interface CollectionObjectResponse {
  objectID: CollectionObjectId;
  title: string;
}

function fetchObject(
  collectionObjectId: CollectionObjectId,
): Promise<Artefact> {
  return axios
    .get<CollectionObjectResponse>(`${baseUrl}/objects/${collectionObjectId}`)
    .then(({ data: collectionObject }) => {
      const artefact: Artefact = {
        title: collectionObject.title,
        apiSource: "MET",
      };
      return artefact;
    })
    .catch(() => {
      throw new Error("Error in MET API");
    });
}

export function search(searchTerm: string): Promise<Artefact[]> {
  return axios
    .get<SearchResponse>(`${baseUrl}/search`, {
      params: { q: searchTerm },
    })
    .then(({ data: { objectIDs: collectionObjectIds } }) => {
      return collectionObjectIds.map<Artefact>((collectionObjectId) => ({
        title: "Loading...",
        apiSource: "MET",
        lazyLoading: () => fetchObject(collectionObjectId),
      }));
    })
    .catch((err) => {
      throw new Error(`MET: ${err}`);
    });
}
