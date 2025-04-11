import * as vaApi from "./va.api";
import * as metApi from "./met.api";
import { useQueries, UseQueryResult } from "@tanstack/react-query";

type ApiSource = "MET" | "V&A";

export interface Artefact {
  title: string;
  apiSource: ApiSource;
  lazyLoading?: () => Promise<Artefact>;
}

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
