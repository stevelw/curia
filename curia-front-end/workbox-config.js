module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{js,ico,png,html,json}"],
  swDest: "dist/sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
