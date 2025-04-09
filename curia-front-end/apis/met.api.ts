import axios from "axios";
import { Artefact } from "./aggregated.api";

export const name = "MET API";

type ObjectId = number;

interface Response {
  objectIDs: ObjectId[];
}

export function search(searchTerm: string): Promise<Artefact[]> {
  return axios
    .get<Response>(
      "https://collectionapi.metmuseum.org/public/collection/v1/search",
      {
        params: { q: searchTerm },
      },
    )
    .then(({ data }) => {
      return data.objectIDs.map<Artefact>((objectId) => ({
        Title: objectId.toString(),
      }));
    })
    .catch((err) => {
      throw new Error(`MET: ${err}`);
    });
}
