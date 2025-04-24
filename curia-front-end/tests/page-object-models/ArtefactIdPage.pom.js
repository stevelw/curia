/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { baseUrl } from "./baseUrls.js";

export class ArtefactIdPage {
  page;
  BackButtonLocator;

  constructor(page) {
    this.page = page;
    this.BackButtonLocator = page.getByRole("link", { name: "Curia, back" });
  }
  async goto() {
    await this.page.goto(`${baseUrl}/artefact/vaO1190229`);
  }
}
