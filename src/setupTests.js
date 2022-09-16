// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
// Fix react-plotly import: https://github.com/plotly/react-plotly.js/issues/115
import "jest-canvas-mock";
window.URL.createObjectURL = function () {};
// Can't load remote CDN with jest so loadPyodide is not available
// TypeError: window.loadPyodide is not a function
