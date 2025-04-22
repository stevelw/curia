import { test, expect } from "@playwright/test";
import { RootPage } from "../page-object-models/Root.pom";

test("dev tools are not visible in production", async ({ page }) => {
  const { env } = process as { env: { CI: string } };
  if (env.CI === "1") {
    const rootPage = new RootPage(page);
    await rootPage.goto();
    expect(rootPage.TanStackQueryDevtoolsLocator).toBeFalsy();
  }
});
