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
}

export { Artefact, SearchFnReturn };
