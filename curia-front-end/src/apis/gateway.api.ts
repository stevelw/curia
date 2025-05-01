import { Api } from "./api.class";
import Artefact, { LocalId } from "./Artefact.interface";
import { metApi } from "./met.api";
import { vaApi } from "./va.api";

export const availableApis: Api[] = [vaApi, metApi];

export function fetchArtefact(localId: LocalId): Promise<Artefact> {
  return (
    availableApis.find((api) => api.isHandled(localId))?.fetch(localId) ??
    Promise.reject(new Error("No matching API found"))
  );
}

export function apiDetailsForArtefact(localId: LocalId): {
  fetchFn: () => Promise<Artefact>;
  staleTime: number;
  garbageCollectionTime: number;
} {
  const api = availableApis.find((api) => api.isHandled(localId));

  if (!api) {
    throw new Error("No matching API found");
  }

  return {
    fetchFn: () => fetchArtefact(localId),
    staleTime: api.staleTime,
    garbageCollectionTime: api.garbageCollectionTime,
  };
}
