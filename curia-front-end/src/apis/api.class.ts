import Artefact from "./Artefact.interface";

type SearchFn = (searchTerm: string, maxResults: number) => Promise<Artefact[]>;

export class Api {
  name;
  search;
  constructor(name: string, search: SearchFn) {
    this.name = name;
    this.search = search;
  }
}

export { Artefact };
