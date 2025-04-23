/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, chromium } from "@playwright/test";
import {
  After,
  Before,
  Given,
  setDefaultTimeout,
  Then,
  When,
} from "@cucumber/cucumber";
import { ArtefactIdPage } from "../page-object-models/ArtefactIdPage.pom.js";
setDefaultTimeout(60 * 1000);

let browser;
let artefactIdPage;

Before(async function () {
  browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();

  artefactIdPage = new ArtefactIdPage(await context.newPage());
});

Given("the user uses a deep link", async function () {
  await artefactIdPage.goto();
});

Then("the stack back button is in the stack bar", async function () {
  await expect(artefactIdPage.BackButtonLocator).toBeVisible();
});

When("the user clicks the back button", async function () {
  await artefactIdPage.BackButtonLocator.click();
});

Then("the page navigates to root", async function () {
  await expect(artefactIdPage.BackButtonLocator).not.toBeVisible();
  expect(artefactIdPage.page.url()).toBe(
    "http://localhost:8081/?artefactId=vaO1190229",
  );
});

After(async function () {
  await browser.close();
});
