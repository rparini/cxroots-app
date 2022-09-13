import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import script from "./python/main.py";
import "./App.css";
import { CxPlot } from './CxPlot.js';
import { create, all } from 'mathjs'
import {TextField, Grid, Box, Typography} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const math = create(all)
const nerdamer = require("nerdamer");

const loadPyodide = async () => {
  const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.21.2/full/",
  });
  // Packages in https://github.com/pyodide/pyodide/tree/main/packages
  await pyodide.loadPackage(["micropip", "numpy", "scipy", "sympy"]);
  return pyodide
}

const runCxroots = async (pyodide, python_args) => {
  const scriptText = await (await fetch(script)).text();

  // Set keys on self, so that `from js import key` works.
  window.self["cxroots_args"] = python_args;

  return await pyodide.runPythonAsync(scriptText);
};

const ParseLatex=(text) => {
// This approach excludes sin/cos/exp/log/i
// const regExp = /[a-yA-Z]/g;
// if (regExp.test(text)) {
//   return undefined
// }
try {
  return nerdamer.convertToLaTeX(text);
} catch (error) {
  return undefined;
}
}

const App = () => {
  const [functionText, setFunctionText] = useState("sin(z)+i");
  const [functionLaTeX, setFunctionLaTeX] = useState("f(z)=sin(z)+i");
  const [rootResult, setRootResult] = useState({"roots": [], "multiplicities": []})
  const [previewContour, setPreviewContour] = useState({type: 'circle', center: 0, radius: 3})
  const [loading, setLoading] = useState(false)
  const [pyodide, setPyodide] = useState(null)

  useEffect(() => {
    const latex = ParseLatex(functionText)
    setFunctionLaTeX(latex);
  }, [functionText]);

  if (pyodide === null) {
    setPyodide('loading')
    setLoading(true)
    loadPyodide().then(setPyodide).then(() => setLoading(false))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    const result = await runCxroots(pyodide, {
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
    setLoading(false)
  };


  return (
    <div className="App">
        <Box
          display="flex"
          justifyContent="center"
        >
          <Grid container padding={5} spacing={2} maxWidth={800}>
            <Grid item xs={12}>
              <Typography variant="h2" align="center">
                cxroots
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/* The roots of a function, <TeX math={'f(z)'}/>, of a single complex valued variable, <TeX math={'z'}/>, are the values of <TeX math={'z'}/> for which <TeX math={'f(z)=0'}/>.  */}
              Find all the roots of a function <TeX math={'f(z)'}/> within a given circle in the complex plane.
            </Grid>
            <Grid item xs={12}>
              <TeX math={'f(z)'}/> must have no roots or poles on the circle and must be analytic within the circle
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={functionLaTeX===undefined}
                helperText={functionLaTeX===undefined ? "Unable to parse":undefined}
                variant="outlined"
                label={functionLaTeX===undefined || functionLaTeX==='' ? <TeX math={'f(z)'} /> :  <TeX math={'f(z)='+functionLaTeX} />}
                type='text'
                value={functionText}
                onChange={(event) => setFunctionText(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              Define the circle to find the roots in:
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type='number'
                label='Radius'
                value={previewContour.radius}
                onChange={(event) => setPreviewContour({...previewContour, radius: parseFloat(event.target.value)})}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type='number'
                label={<TeX math={'\\text{Re}[\\text{center}]'}/>}
                value={math.re(previewContour.center)}
                onChange={(event) => setPreviewContour({...previewContour, center: math.complex(event.target.value, math.im(previewContour.center))})}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label={<TeX math={'\\text{Im}[\\text{center}]'}/>}
                value={math.im(previewContour.center)}
                onChange={(event) => setPreviewContour({...previewContour, center: math.complex(math.re(previewContour.center), event.target.value)})}
              />
            </Grid>
            <Grid 
              container
              item xs={12}   
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <LoadingButton 
                loading={loading} 
                disabled={functionLaTeX===undefined || functionLaTeX===''} 
                variant="contained" 
                onClick={handleSubmit}>
                  Find the Roots
                </LoadingButton>
            </Grid>
            <Grid 
              container
              item xs={12}   
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <CxPlot
                functionText={rootResult.functionText}
                roots={rootResult.roots} 
                multiplicities={rootResult.multiplicities} 
                contour={rootResult.contour} 
                previewContour={previewContour}
              />
            </Grid>
          </Grid>
        </Box>
    </div>
  );
};

export default App;
