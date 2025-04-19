import Artefact from "./Artefact.interface";

interface SearchFnReturn {
  totalResultsAvailable: number;
  results: Artefact[];
}

type SearchFn = (
  searchTerm: string,
  maxResults: number,
) => Promise<SearchFnReturn>;

export class Api {
  name;
  search;
  constructor(name: string, search: SearchFn) {
    this.name = name;
    this.search = search;
  }
}

export { Artefact, SearchFnReturn };
