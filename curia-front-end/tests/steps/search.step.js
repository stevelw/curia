/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { SearchPage } from "../page-object-models/Search.pom.js";

setDefaultTimeout(60 * 1000);

let browser;
let searchPage;

Before(async function () {
  browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  searchPage = new SearchPage(await context.newPage());
});

Given("maker is selected for sort order", async () => {
  await searchPage.goto();
  await searchPage.search("China");
  if (await searchPage.sortByMakerButtonLocator.isEnabled())
    await searchPage.sortByMakerButtonLocator.click();
});

Given("current location is selected for sort order", async () => {
  await searchPage.goto();
  await searchPage.search("China");
  if (await searchPage.sortByCurrentLocationButtonLocator.isEnabled())
    await searchPage.sortByCurrentLocationButtonLocator.click();
});

When("the results are displayed", async () => {
  await expect(searchPage.makerLocators.first()).toBeVisible({
    timeout: 10000,
  });
  await searchPage.page.waitForLoadState("networkidle");
});

Then("the results are ordered by maker", async () => {
  const makers = await searchPage.makerLocators.evaluateAll((locators) =>
    locators.map((locator) => locator.textContent),
  );
  for (let i = 1; i < makers.length - 1; i++) {
    expect(makers[i] >= makers[i - 1]).toBeTruthy();
  }
});

Then("the results are ordered by current location", async () => {
  const currentLocations = await searchPage.currentLocationLocators.evaluateAll(
    (locators) => locators.map((locator) => locator.textContent),
  );
  for (let i = 1; i < currentLocations.length - 1; i++) {
    expect(currentLocations[i] >= currentLocations[i - 1]).toBeTruthy();
  }
});

After(async function () {
  await browser.close();
});
