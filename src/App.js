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
  await pyodide.loadPackage(["micropip", "numpy", "scipy"]);

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
    const latex = nerdamer.convertToLaTeX("f(z)=" + functionText);
    console.log(latex);
    setFunctionLaTeX(latex);
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(functionText);
    setOutput("(Loading ... )");
    const out = await runCxroots({ foo: functionText });
    setOutput(out);
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
        <p>{functionLaTeX} </p>
        <TeX math={functionLaTeX} block />
        <p>Result = {output}</p>
      </header>
    </div>
  );
};

export default App;
