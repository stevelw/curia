import { test, expect } from "@playwright/test";
import { ArtefactIdPage } from "../page-object-models/ArtefactIdPage.pom";

test("directly loading an artefact page has a back button to return to root", async ({
  page,
}) => {
  const loginPage = new ArtefactIdPage(page);

  await loginPage.goto();

  await expect(loginPage.BackButtonLocator).toBeVisible();

  await loginPage.BackButtonLocator.click();

  await expect(loginPage.BackButtonLocator).not.toBeVisible();

  expect(loginPage.page.url()).toBe(
    "https://curia.netlify.app/?artefactId=vaO1190229",
  );
});
