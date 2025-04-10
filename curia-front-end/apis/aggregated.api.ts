import * as vaApi from "./va.api";
import * as metApi from "./met.api";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import Artefact from "../interfaces/Artefact.interface";

export function useArtefactSearch(
  searchTerm: string,
): UseQueryResult<Artefact[]>[] {
  const apis = [metApi, vaApi];
  return useQueries({
    queries: apis.map((api) => ({
      queryKey: ["search", api.name],
      queryFn: () => {
        return api.search(searchTerm);
      },
    })),
  });
}
