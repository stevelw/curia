/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export class RootPage {
  page;
  TanStackQueryDevtoolsLocator;

  constructor(page) {
    this.page = page;
    this.TanStackQueryDevtoolsLocator = page.getByTestId("devtools");
  }
  async goto() {
    await this.page.goto("http://localhost:8081", { waitUntil: "networkidle" });
  }
  async gotoProduction() {
    await this.page.goto("https://curia.netlify.app", {
      waitUntil: "networkidle",
    });
  }
}
