import Artefact, { LocalId, ObjectType } from "./Artefact.interface";

interface SearchFnReturn {
  totalResultsAvailable: number;
  objectTypes: ObjectType[];
  currentLocations: string[];
  results: Artefact[];
}

type FetchFn = (localId: LocalId) => Promise<Artefact>;

type SearchFn = (
  searchTerm: string,
  sortBy: SortOptions,
  objectTypeFilters: ObjectType[],
  currentLocationFilters: string[],
) => Promise<SearchFnReturn>;

enum SortOptions {
  Maker = "Maker",
  Location = "Current location",
}

export class Api {
  name;
  slug;
  fetch;
  search;
  staleTime;
  garbageCollectionTime;
  constructor(
    name: string,
    slug: string,
    fetch: FetchFn,
    search: SearchFn,
    staleTime: number = 1000 * 60 * 60 * 4,
    garbageCollectionTime: number = 1000 * 60 * 60 * 4,
  ) {
    this.name = name;
    this.slug = slug;
    this.fetch = fetch;
    this.search = search;
    this.staleTime = staleTime;
    this.garbageCollectionTime = garbageCollectionTime;
  }

  isHandled(localId: LocalId): boolean {
    const apiSlugRegex = new RegExp(`^${this.slug}`);
    return !!localId.match(apiSlugRegex);
  }

  remoteIdFrom(localId: LocalId): string {
    return localId.substring(this.slug.length);
  }

  localIdFrom(remoteId: string): LocalId {
    return this.slug + remoteId;
  }
}

export { Artefact, SearchFnReturn, LocalId, SortOptions };
