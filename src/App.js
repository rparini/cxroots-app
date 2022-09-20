import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import script from "./python/main.py";
import "./App.css";
import { CxPlot } from "./CxPlot.js";
import { create, all } from "mathjs";
import { TextField, Grid, Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const pyodideURL = "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/";
const math = create(all);
const nerdamer = require("nerdamer");

function loadScript(url) {
  return new Promise(function (resolve, reject) {
    let script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

const loadPyodide = async () => {
  await loadScript(pyodideURL + "pyodide.js");
  const pyodide = await window.loadPyodide({
    indexURL: pyodideURL,
  });
  // Packages in https://github.com/pyodide/pyodide/tree/main/packages
  await pyodide.loadPackage(["micropip", "numpy", "scipy", "sympy"]);
  return pyodide;
};

export const runCxroots = async (pyodide, pythonArgs) => {
  const scriptText = await (await fetch(script)).text();

  // Set keys on self, so that `from js import key` works.
  window.self["cxroots_args"] = pythonArgs;

  return await pyodide.runPythonAsync(scriptText);
};

/**
 * PyodideButton loads pyodide before being clickable and does
 * not allow the button to be clicked while pyodide is running
 */
export const PyodideButton = ({ disabled, onClick }) => {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(false);

  if (pyodide == null) {
    setPyodide("loading");
    setLoading(true);
    loadPyodide()
      .then(setPyodide)
      .then(() => setLoading(false));
  }

  const onClickLoading = async (event) => {
    setLoading(true);
    await onClick(event, pyodide);
    setLoading(false);
  };

  return (
    <LoadingButton
      loading={loading}
      disabled={disabled}
      variant="contained"
      onClick={onClickLoading}
    >
      Find the Roots
    </LoadingButton>
  );
};

const ParseLatex = (text) => {
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
};

export const App = () => {
  const [functionText, setFunctionText] = useState("sin(z)+i");
  const [functionLaTeX, setFunctionLaTeX] = useState("f(z)=sin(z)+i");
  const [rootResult, setRootResult] = useState({
    roots: [],
    multiplicities: [],
  });
  const [previewContour, setPreviewContour] = useState({
    type: "circle",
    centerRe: 0,
    centerIm: 0,
    radius: 3,
  });

  useEffect(() => {
    const latex = ParseLatex(functionText);
    setFunctionLaTeX(latex);
  }, [functionText]);

  const handleSubmit = async (event, pyodide) => {
    event.preventDefault();
    const result = await runCxroots(pyodide, {
      function_string: functionText,
      circle_center: math.complex(
        previewContour.centerRe,
        previewContour.centerIm
      ),
      circle_radius: previewContour.radius,
    });

    let roots = result.get("roots");
    let multiplicities = result.get("multiplicities");
    multiplicities = multiplicities.toJs();
    // .toJs does not automatically work for complex numbers so workaround
    roots = roots.toJs({ depth: 1 }).map((z) => z.toString());
    // () replacement because math.complex can't handle "(1+1i)", has to be "1+1i"
    roots = roots.map((z) =>
      z.replace("j", "i").replace("(", "").replace(")", "")
    );
    roots = roots.map((z) => math.complex(z));
    setRootResult({
      functionText: functionLaTeX,
      roots: roots,
      multiplicities: multiplicities,
      contour: previewContour,
    });
  };

  return (
    <div className="App">
      <Box display="flex" justifyContent="center">
        <Grid
          container
          padding={5}
          spacing={2}
          maxWidth={800}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12}>
            <Typography variant="h2" align="center">
              cxroots
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {/* The roots of a function, <TeX math={'f(z)'}/>, of a single complex valued variable, <TeX math={'z'}/>, are the values of <TeX math={'z'}/> for which <TeX math={'f(z)=0'}/>.  */}
            Find all the roots of a function <TeX math={"f(z)"} /> within a
            given circle in the complex plane. <TeX math={"f(z)"} /> must have
            no roots or poles on the circle and must be analytic within the
            circle.
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={functionLaTeX === undefined}
              helperText={functionLaTeX === undefined ? "Unable to parse" : ""}
              variant="outlined"
              label={
                functionLaTeX === undefined || functionLaTeX === "" ? (
                  <TeX math={"f(z)"} />
                ) : (
                  <TeX math={"f(z)=" + functionLaTeX} />
                )
              }
              type="text"
              value={functionText}
              onChange={(event) => setFunctionText(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            Define the circle to find the roots in:
          </Grid>
          <Grid item xs={4} style={{ minWidth: "120px" }}>
            <TextField
              fullWidth
              type="number"
              label={<TeX math={"\\text{Re}[\\text{center}]"} />}
              InputLabelProps={{ shrink: true }}
              defaultValue={0}
              onChange={(event) =>
                setPreviewContour({
                  ...previewContour,
                  centerRe: parseFloat(event.target.value),
                })
              }
              error={isNaN(previewContour.centerRe)}
              helperText={
                isNaN(previewContour.centerRe) ? "Must be a number" : " "
              }
            />
          </Grid>
          <Grid item xs={4} style={{ minWidth: "120px" }}>
            <TextField
              fullWidth
              type="number"
              label={<TeX math={"\\text{Im}[\\text{center}]"} />}
              InputLabelProps={{ shrink: true }}
              defaultValue={0}
              onChange={(event) =>
                setPreviewContour({
                  ...previewContour,
                  centerIm: parseFloat(event.target.value),
                })
              }
              error={isNaN(previewContour.centerIm)}
              helperText={
                isNaN(previewContour.centerIm) ? "Must be a number" : " "
              }
            />
          </Grid>
          <Grid item xs={4} style={{ minWidth: "120px" }}>
            <TextField
              fullWidth
              type="number"
              label="Radius"
              value={previewContour.radius}
              inputProps={{ inputMode: "numeric", min: 0 }}
              onChange={(event) =>
                setPreviewContour({
                  ...previewContour,
                  radius: parseFloat(event.target.value),
                })
              }
              error={previewContour.radius <= 0}
              helperText={
                previewContour.radius <= 0 ? "Must be a number > 0" : " "
              }
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <PyodideButton
              disabled={
                functionLaTeX === undefined ||
                functionLaTeX === "" ||
                isNaN(previewContour.centerRe) ||
                isNaN(previewContour.centerIm) ||
                previewContour.radius <= 0
              }
              onClick={handleSubmit}
            >
              Find the Roots
            </PyodideButton>
          </Grid>
          <Grid
            container
            item
            xs={12}
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
