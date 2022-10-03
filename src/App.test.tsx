import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders page", () => {
  render(<App />);
  const linkElement = screen.getByText("cxroots");
  expect(linkElement).toBeInTheDocument();
});

/** making any actual remote call times out in Jest */
// test("runCxroots", () => {
//   const pythonArgs = {
//     function_string: "(z-1)^2",
//     circle_center: 0,
//     circle_radius: 3,
//   };
//   return loadPyodide()
//     .then((pyodide) => runCxroots(pyodide, pythonArgs))
//     .then((result) => {
//       expect(result).toBe({ roots: [1], multiplicities: [2] });
//     });
// }, 600000);
