import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import script from "./python/main.py";
import "./App.css";
import { CxPlot } from './CxPlot.js';
import { create, all } from 'mathjs'
import {Button, TextField} from '@mui/material';

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

const ParseLatex=(text) => {
const regExp = /[a-yA-Z]/g;
if (regExp.test(text)) {
  return undefined
}
try {
  return nerdamer.convertToLaTeX(text);
} catch (error) {
  return undefined;
}
}

const App = () => {
  const [functionText, setFunctionText] = useState("");
  const [functionLaTeX, setFunctionLaTeX] = useState("f(z)=");
  const [rootResult, setRootResult] = useState({"roots": [], "multiplicities": []})
  const [previewContour, setPreviewContour] = useState({type: 'circle', center: 0, radius: 2})

  useEffect(() => {
    const latex = ParseLatex(functionText)
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
      <header>
        cxroots: A rootfinder for complex analytic functions
        <br></br><br></br>
        <label>
          <TextField
            error={functionLaTeX===undefined}
            helperText={functionLaTeX===undefined ? "Unable to parse":undefined}
            variant="outlined"
            label={functionLaTeX===undefined || functionLaTeX=='' ? <TeX math={'f(z)'} /> :  <TeX math={'f(z)='+functionLaTeX} />}
            type='text'
            onChange={(event) => setFunctionText(event.target.value)}
          />
          <Button disabled={functionLaTeX===undefined || functionLaTeX==''} variant="contained" onClick={handleSubmit}>Find the Roots</Button>
        </label>
        Find all the roots within a 
        circle
        of radius:
        <input
          type="number"
          value={previewContour.radius}
          onChange={(event) => setPreviewContour({...previewContour, radius: parseFloat(event.target.value)})}
        />
        and center:
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
