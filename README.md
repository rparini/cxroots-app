[![Test](https://github.com/rparini/cxroots-app/actions/workflows/test.yml/badge.svg)](https://github.com/rparini/cxroots-app/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/rparini/cxroots-app/badge.svg?branch=master)](https://coveralls.io/github/rparini/cxroots-app?branch=master)

# https://rparini.github.io/cxroots-app/

A React web application demonstrating the [cxroots](https://github.com/rparini/cxroots) Python library, using [Pyodide](https://pyodide.org/en/stable/) to run Python in the browser.

## Development

[Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage node versions. Then install the required node version with:

```
nvm install
nvm use
```

[Enable yarn](https://yarnpkg.com/getting-started/install) with

```
corepack enable
```

and then install the packages needed to build the application

```
yarn install --frozen-lockfile
```

You can then start a local server with

```
yarn start
```

- Install [pre-commit](https://pre-commit.com/) and then run `pre-commit install`. The pre-commit scripts can also be run manually with `pre-commit run --all-files`
- The project uses [prettier](https://prettier.io/) to maintain consistent formatting. It is run as part of the pre-commit hook and is recommended to be run on save in the developer's editor.

### Testing

Tests are run with [Jest](https://jestjs.io/) and are invoked with

```
yarn test
```

Tests are [run in CI](https://github.com/rparini/cxroots-app/actions/workflows/test.yml) and a coverage report is uploaded to [Coveralls](https://coveralls.io/github/rparini/cxroots-app)

## Acknowledgement

Used https://github.com/xhlulu/react-pyodide-template as an original JS template
