# cxroots-app: https://cxroots.herokuapp.com/

A web application demonstrating some of the features of [cxroots](https://github.com/rparini/cxroots).

## Dev

npm i
npm start

## Production

npm i -g serve
serve -s build

## Acknowledgement

Used https://github.com/xhlulu/react-pyodide-template as an original JS template

## TODO

-   Plot roots
-   Error when entering 2x "Invalid integer: NaN"
-   Raise an error if a variable other than `z` is entered
-   Can latex rerender logic be simplified?
-   Firefox out of memory error after running pyodide a few times: https://github.com/pyodide/pyodide/issues/1333
-   Convert to TS: https://github.com/pyodide/pyodide/issues/552#issuecomment-781770000
