import { env } from "process";

const BASE_DEV_URL = "http://localhost:8081";
const BASE_PROD_URL = "https://curia.netlify.app";

export const baseUrl =
  "CI" in env && env.CI === "1" ? BASE_PROD_URL : BASE_DEV_URL;
