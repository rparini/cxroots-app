/// <reference types="@vitest/browser/context" />
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { App } from "./App";
import React from "react";

test("App renders", async () => {
  const { getByText } = render(<App />);
  await expect.element(getByText("cxroots")).toBeInTheDocument();
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
