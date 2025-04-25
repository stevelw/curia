/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { baseUrl } from "./baseUrls.js";

export class SearchPage {
  page;
  sortByMakerButtonLocator;
  sortByCurrentLocationButtonLocator;
  searchBoxLocator;
  makerLocators;
  currentLocationLocators;

  constructor(page) {
    this.page = page;
    this.sortByMakerButtonLocator = page.getByRole("button", {
      name: "Maker",
    });
    this.sortByCurrentLocationButtonLocator = page.getByRole("button", {
      name: "Current location",
    });
    this.searchBoxLocator = page.getByRole("textbox");
    this.makerLocators = page
      .getByRole("listitem")
      .getByRole("paragraph")
      .getByText("Made by:");
    this.currentLocationLocators = page.getByText("Current location:");
  }

  async goto() {
    await this.page.goto(baseUrl, { waitUntil: "networkidle" });
  }

  async search(searchTerm) {
    await this.searchBoxLocator.fill(searchTerm);
    await this.searchBoxLocator.press("Enter");
  }
}
