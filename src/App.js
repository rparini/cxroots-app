import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import script from "./python/main.py";
import "./App.css";
import { CxPlot } from './CxPlot.js';
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

const nerdamer = require("nerdamer");

const runCxroots = async (python_args) => {
  const scriptText = await (await fetch(script)).text();

  const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.21.2/full/",
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
  const [previewContour, setPreviewContour] = useState({type: 'circle', center: 0, radius: 2})

  useEffect(() => {
    let latex = "";
    try {
      latex = nerdamer.convertToLaTeX(functionText);
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
      circle_center: previewContour.center,
      circle_radius: previewContour.radius,
    });

    console.log("result", result);
    let roots = result.get('roots');
    let multiplicities = result.get('multiplicities');
    multiplicities = multiplicities.toJs()
    // .toJs does not automatically work for complex numbers so workaround
    roots = roots.toJs({depth : 1}).map(z => z.toString())
    roots = roots.map(z => z.replace('j','i'))
    roots = roots.map(z => math.complex(z))
    setRootResult({
      "functionText": functionLaTeX, 
      "roots": roots, 
      "multiplicities": multiplicities, 
      "contour": previewContour
    })
  };


  return (
    <div className="App">
      <header className="App-header">
        cxroots: A rootfinder for complex analytic functions
        <form onSubmit={handleSubmit}>
          <p><label>
            <TeX math="f(z)= " />
            <input
              type="text"
              onChange={(event) => setFunctionText(event.target.value)}
            />
            <TeX math={'f(z)= '+functionLaTeX} block />
          </label></p>
          <p>
          Circle radius:
          <input
            type="number"
            value={previewContour.radius}
            onChange={(event) => setPreviewContour({...previewContour, radius: parseFloat(event.target.value)})}
          />
          </p>
          Circle center:
          <input
            type="number"
            value={math.re(previewContour.center)}
            onChange={(event) => setPreviewContour({...previewContour, center: math.complex(event.target.value, math.im(previewContour.center))})}
          />
          +i
          <input
            type="number"
            value={math.im(previewContour.center)}
            onChange={(event) => setPreviewContour({...previewContour, center: math.complex(math.re(previewContour.center), event.target.value)})}
          />
          <p><input type="submit" value="Solve" /></p>
        </form>
        <CxPlot
          functionText={rootResult.functionText}
          roots={rootResult.roots} 
          multiplicities={rootResult.multiplicities} 
          contour={rootResult.contour} 
          previewContour={previewContour}
        />
      </header>
    </div>
  );
};

export default App;
