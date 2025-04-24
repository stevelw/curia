/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, chromium } from "@playwright/test";
import {
  After,
  Before,
  Given,
  setDefaultTimeout,
  Then,
  When,
} from "@cucumber/cucumber";
import { RootPage } from "../page-object-models/Root.pom.js";
setDefaultTimeout(60 * 1000);

let browser;
let rootPage;

Before(async function () {
  browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  rootPage = new RootPage(await context.newPage());
});

Given("the environment is production", function () {
  if (process.env.CI !== "1") return "pending";
});

When("the page is displayed", async function () {
  await rootPage.goto();
});

Then("the dev tools should not be visible", async function () {
  await expect(rootPage.TanStackQueryDevtoolsLocator).not.toBeVisible();
});

After(async function () {
  await browser.close();
});
