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
  constructor(name: string, slug: string, fetch: FetchFn, search: SearchFn) {
    this.name = name;
    this.slug = slug;
    this.fetch = fetch;
    this.search = search;
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
