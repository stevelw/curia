# Curia

Curia is a cross-repository search platform for antiquities and fine arts. The platform was contracted for by [Tech Returners](https://www.techreturners.com) who retain all copyright to the code, and is made available here by permission.

The example 'production' version is published at [curia.netlify.app](https://curia.netlify.app) for experimentation.

## Code stack

- MongoDB database, hosted on Atlas, to store user account details and exhibition data
- NestJS backend, hosted on Render, to provide a REST API to securely access the database. Protected endpoints are guarded by bearer access token
- React Native frontend, hosted on Netlify, to provide a Progressive Web App (PWA)

## Features

- Search for antiquities and fine arts across multiple sources
  - Support for _The Metropolitan Museum of Art_ and _The V&A_ is built in
  - Other sources can be easily added by creating an API object, providing a name, identification slug, fetch function, and search function
- Keep a private unified list of favourite artefacts
- Create public exhibition lists of artefacts that can be easily shared

## Data Sources

Curia is designed as an extensible platform, and some example API integrations are included.

### The Metropolitan Museum of Art

[The Met's API](https://metmuseum.github.io) provides select datasets for unrestricted commercial and noncommercial use using the [Creative Commons Zero license](https://creativecommons.org/publicdomain/zero/1.0/).

### The V&A

[The V&A's API](https://developers.vam.ac.uk) is covered by their [Terms and Conditions](https://www.vam.ac.uk/info/va-websites-terms-conditions) (in particular Section 9). Below are some important clauses to be aware of when developing this integration.

> You are welcome to use the V&A's application programming interfaces (APIs) to enhance your use of Content for non-commercial personal and educational purposes. If you wish to use our APIs for commercial purposes you must contact V&A Images at: vaimages@vam.ac.uk.

> The V&A is constantly updating the database. You will not cache or store any content returned by the V&A API for more than four weeks.

> If you display images in your website or application you must use the image url returned by our API rather than create a copy on your local web server.

| Collections API |                                               |
| --------------- | --------------------------------------------- |
| Author          | Victoria and Albert Museum                    |
| Title           | Victoria and Albert Museum Collections API v2 |
| Year            | 2021                                          |
| Version         | 2                                             |
| URL             | https://developers.vam.ac.uk                  |

| Collections Data |                                             |
| ---------------- | ------------------------------------------- |
| Author           | Victoria and Albert Museum                  |
| Title            | Victoria and Albert Museum Collections Data |
| Year             | 2021                                        |
| URL              | https://collections.vam.ac.uk               |

## Building the app

1. Clone the monorepo: `git clone https://github.com/stevelw/curia.git`
2. Install dependencies:
   1. Install global dependencies: `cd curia && npm i`
   2. Install back end dependencies: `cd curia-back-end && npm i`
   3. Install front end dependencies: `cd ../curia-front-end && npm i`
3. Setup a MongoDB cluster, for example on [Atlas](https://www.mongodb.com/docs/atlas/), and get a connection string
4. Setup .env files:
   1. Back end:
      1. Copy the example back end .env file `curia/curia-back-end/.env-example` and rename it to `.env.test`
      2. Replace the placeholders with your MongoDB connection string and your JWT secret key (i.e. any password style string)
      3. Make two copies of `.env.test` and rename them to `.env.development` and `.env.production`
      4. Edit the connection string in each file to include a unique database name for each environment. For example, `...mongodb.net/curiaDb-test...`. It's good practice to also make your JWT secret unique for each environment
   2. Front end:
      1. Make two copies of the example front end .env file `curia/curia-front-end/.env-example` and rename them to `.env.development` and `.env.production`
      2. Replace the placeholders with the host of your backend (by default this will be `http://localhost:3000` for development) and the host for your front end (by default this will be `http://localhost:8081` for development)
5. Run tests:
   1. If not already installed, install dotenvx: `npm i -g dotenvx`. Alternatively, replace `dotenvx` with `npx dotenvx` in the package.json scripts
   2. Run back end tests: `cd ../curia-back-end && npm t`. This will run unit tests and integration tests.
   3. Run front end tests: `cd ../curia-front-end && npm t`. This will run end-to-end tests, and you will see several browser windows open and close during the tests
6. Run locally:
   1. Seed to development database: `cd ../curia-back-end && npm run seed-dev`
   2. Launch the back end: `cd ../curia-back-end && npm run start:dev`
   3. Launch the front end: `cd ../curia-front-end && npm run web`. (iOS and Android native versions can also be launched, but have not been tested - Curia is primarily a PWA)
7. Build for deployment:
   1. Build the back end: `cd ../curia-back-end && npm run build`
   2. Build the front end: `cd ../curia-front-end && npm run build:web`

## Testing accounts

User accounts can easily be created within the app by providing a unique username and a password - no email loop is required. Some sample accounts are created when seeding - for example:

Username: `Steve`

Password: `secret123`
