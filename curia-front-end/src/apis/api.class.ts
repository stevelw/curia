import Artefact, { LocalId } from "./Artefact.interface";

interface SearchFnReturn {
  totalResultsAvailable: number;
  results: Artefact[];
}

type FetchFn = (localId: LocalId) => Promise<Artefact>;

type SearchFn = (
  searchTerm: string,
  maxResults: number,
) => Promise<SearchFnReturn>;

export class Api {
  name;
  slug;
  fetch;
  search;
  garbageCollectionTime;
  constructor(
    name: string,
    slug: string,
    fetch: FetchFn,
    search: SearchFn,
    garbageCollectionTime: number = 1000 * 60 * 60 * 4,
  ) {
    this.name = name;
    this.slug = slug;
    this.fetch = fetch;
    this.search = search;
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

export { Artefact, SearchFnReturn, LocalId };
