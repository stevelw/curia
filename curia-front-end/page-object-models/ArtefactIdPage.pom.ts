import { Page, Locator } from "@playwright/test";

export class ArtefactIdPage {
  readonly page: Page;
  readonly BackButtonLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.BackButtonLocator = page.getByRole("link", { name: "Curia, back" });
  }
  async goto() {
    await this.page.goto("https://curia.netlify.app/artefact/vaO1190229");
  }
}
