[![Test](https://github.com/rparini/cxroots-app/actions/workflows/test.yml/badge.svg)](https://github.com/rparini/cxroots-app/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/rparini/cxroots-app/badge.svg?branch=master)](https://coveralls.io/github/rparini/cxroots-app?branch=master)

# cxroots-app: https://rparini.github.io/cxroots-app/

A web application demonstrating the [cxroots](https://github.com/rparini/cxroots) Python library and built with [React](https://reactjs.org/) and [Pyodide](https://pyodide.org/en/stable/).

## Development

Start a local server with

```
npm i
npm start
```

- Install [pre-commit](https://pre-commit.com/) and then run `pre-commit install`. The pre-commit scripts can also be run manually with `pre-commit run --all-files`
- The project uses [prettier](https://prettier.io/) to maintain consistent formatting. It is run as part of the pre-commit hook and is recommended to be run on save in the developer's editor.

### Testing

Tests are run with [Jest](https://jestjs.io/) and are invoked with

```
npm test
```

Tests are [run in CI](https://github.com/rparini/cxroots-app/actions/workflows/test.yml) and a coverage report is uploaded to [Coveralls](https://coveralls.io/github/rparini/cxroots-app)

## Acknowledgement

Used https://github.com/xhlulu/react-pyodide-template as an original JS template
