import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import script from "./python/main.py";
import logo from "./logo.svg";
import "./App.css";
import { CxPlot } from './CxPlot.js';
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

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
  const [functionText, setFunctionText] = useState("");
  const [functionLaTeX, setFunctionLaTeX] = useState("f(z)=");
  const [rootResult, setRootResult] = useState({"roots": [], "multiplicities": []})
  const [contour, setContour] = useState({type: 'circle', center: 0, radius: 2})

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
    const result = await runCxroots({
      function_string: functionText,
      circle_center: contour.center,
      circle_radius: contour.radius,
    });

    console.log("result", result);
    var roots = result.get('roots');
    var multiplicities = result.get('multiplicities');
    multiplicities = multiplicities.toJs()
    // .toJs does not automatically work for complex numbers so workaround
    roots = roots.toJs({depth : 1}).map(z => z.toString())
    roots = roots.map(z => z.replace('j','i'))
    roots = roots.map(z => math.complex(z))
    setRootResult({"roots": roots, "multiplicities": multiplicities})
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
        <CxPlot roots={rootResult.roots} multiplicities={rootResult.multiplicities} contour={contour}/>
      </header>
    </div>
  );
};

export default App;
