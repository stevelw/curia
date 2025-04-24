/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { baseUrl } from "./baseUrls.js";

export class RootPage {
  page;
  TanStackQueryDevtoolsLocator;

  constructor(page) {
    this.page = page;
    this.TanStackQueryDevtoolsLocator = page.getByTestId("devtools");
  }
  async goto() {
    await this.page.goto(baseUrl, { waitUntil: "networkidle" });
  }
}
