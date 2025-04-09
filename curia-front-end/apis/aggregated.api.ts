import * as vaApi from "./va.api";
import * as metApi from "./met.api";

export interface Artefact {
  Title: string;
}

export function search(searchTerm: string): Promise<Artefact[]> {
  return Promise.all([
    metApi.search(searchTerm),
    vaApi.search(searchTerm, 10, 1),
  ])
    .then(([metArtefacts, vaArtefacts]) => {
      return [...metArtefacts, ...vaArtefacts].sort((a, b) => {
        const titleA = a.Title.toUpperCase();
        const titleB = b.Title.toUpperCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }

        return 0;
      });
    })
    .catch((err) => {
      throw new Error(`API error: ${err}`);
    });
}
