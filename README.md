# Curia

Curia is a cross-repository search platform for antiquities and fine arts. The platform was contracted for by [Tech Returners](https://www.techreturners.com) who retain all copyright to the code, and is made available here by permission.

The example 'production' version is published at [curia.netlify.app](https://curia.netlify.app) for experimentation.

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
