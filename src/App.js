import { useState, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import script from "./python/main.py";
import logo from "./logo.svg";
import "./App.css";

var nerdamer = require("nerdamer");

const runCxroots = async (python_args) => {
  const scriptText = await (await fetch(script)).text();

  const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
  });
  // Packages in https://github.com/pyodide/pyodide/tree/main/packages
  await pyodide.loadPackage(["micropip", "numpy", "scipy", "sympy"]);

  // Set keys on self, so that `from js import key` works.
  window.self["cxroots_args"] = python_args;

  return await pyodide.runPythonAsync(scriptText);
};

const App = () => {
  const [output, setOutput] = useState("(Click the button!)");
  const [functionText, setFunctionText] = useState("");
  const [functionLaTeX, setFunctionLaTeX] = useState("f(z)=");

  useEffect(() => {
    console.log(functionText);
    var latex = "f(z)=";
    try {
      latex = "f(z)=" + nerdamer.convertToLaTeX(functionText);
    } catch (error) {
      latex = "\\text{Unable to parse}";
    }
    console.log('latex f:', latex);
    setFunctionLaTeX(latex);
  }, [functionText]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(functionText);
    setOutput("(Loading ... )");
    const result = await runCxroots({
      function_string: functionText,
      circle_center: 0,
      circle_radius: 2,
    });

    console.log("result");
    console.log(result.get("roots"));
    console.log(result.get("multiplicities"));

    setOutput("got the result");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form onSubmit={handleSubmit}>
          <label>
            <TeX math="f(z)= " />
            <input
              type="text"
              onChange={(event) => setFunctionText(event.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <TeX math={functionLaTeX} block />
        <p>Result = {output}</p>
      </header>
    </div>
  );
};

export default App;
