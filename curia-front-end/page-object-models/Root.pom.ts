import { Page, Locator } from "@playwright/test";

export class RootPage {
  readonly page: Page;
  readonly TanStackQueryDevtoolsLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.TanStackQueryDevtoolsLocator = page.getByTestId("devtools");
  }
  async goto() {
    await this.page.goto("http://localhost:8081", { waitUntil: "networkidle" });
  }
}
