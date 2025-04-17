import Artefact from "./Artefact.interface";

export class Api {
  name;
  search;
  constructor(
    name: string,
    search: (searchTerm: string) => Promise<Artefact[]>,
  ) {
    this.name = name;
    this.search = search;
  }
}

export { Artefact };
