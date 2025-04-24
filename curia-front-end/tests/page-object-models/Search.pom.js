/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { baseUrl } from "./baseUrls.js";

export class SearchPage {
  page;
  sortByMakerButtonLocator;
  searchBoxLocator;
  makerLocators;

  constructor(page) {
    this.page = page;
    this.sortByMakerButtonLocator = page.getByRole("button", {
      name: "Maker",
    })
    this.searchBoxLocator = page.getByRole("textbox");
    this.makerLocators = page.getByText("Made by:")
  }

  async goto() {
    await this.page.goto(baseUrl, { waitUntil: "networkidle" });
  }

  async search(searchTerm) {
    await this.searchBoxLocator.fill(searchTerm);
    await this.searchBoxLocator.press("Enter");
  }
}
