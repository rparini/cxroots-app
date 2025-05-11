import React from "react";
import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
// @ts-ignore
import script from "./python/main.py";
import "./App.css";
import { CxPlot, Contour } from "./components/CxPlot";
import { PyodideButton } from "./components/PyodideButton";
import { Complex, complex } from "mathjs";
import { TextField, Grid, Box, Typography } from "@mui/material";
import { convertToLaTeX } from "nerdamer";

export const runCxroots = async (
  pyodide: any,
  pythonArgs: {
    function_string: string;
    circle_center: Complex;
    circle_radius: number;
  },
) => {
  const scriptText = await (await fetch(script)).text();

  // Set keys on self, so that `from js import key` works.
  // @ts-ignore
  window.self["cxroots_args"] = pythonArgs;

  return await pyodide.runPythonAsync(scriptText);
};

const ParseLatex = (text: string) => {
  // This approach excludes sin/cos/exp/log/i
  // const regExp = /[a-yA-Z]/g;
  // if (regExp.test(text)) {
  //   return undefined
  // }
  try {
    return convertToLaTeX(text);
  } catch (error) {
    return undefined;
  }
};

type RootResult = {
  functionText: string | undefined;
  roots: Complex[];
  multiplicities: number[];
  contour?: Contour;
};

export const App = () => {
  const [functionText, setFunctionText] = useState("sin(z)+i");
  const [functionLaTeX, setFunctionLaTeX] = useState<string | undefined>(
    "f(z)=sin(z)+i",
  );
  const [rootResult, setRootResult] = useState<RootResult>({
    functionText: "",
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

  const handleSubmit = async (
    event: React.MouseEvent<HTMLElement>,
    pyodide: any,
  ) => {
    event.preventDefault();
    const result = await runCxroots(pyodide, {
      function_string: functionText,
      circle_center: complex(previewContour.centerRe, previewContour.centerIm),
      circle_radius: previewContour.radius,
    });

    let roots = result.get("roots");
    let multiplicities = result.get("multiplicities");
    multiplicities = multiplicities.toJs();
    // .toJs does not automatically work for complex numbers so workaround
    roots = roots.toJs({ depth: 1 });
    roots = roots.map((z: number | string) => z.toString());
    // () replacement because math.complex can't handle "(1+1i)", has to be "1+1i"
    roots = roots.map((z: string) =>
      z.replace("j", "i").replace("(", "").replace(")", ""),
    );
    roots = roots.map((z: string) => complex(z));
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
          <Grid size={12}>
            <Typography variant="h2" align="center">
              cxroots
            </Typography>
          </Grid>
          <Grid size={12}>
            {/* The roots of a function, <TeX math={'f(z)'}/>, of a single complex valued variable, <TeX math={'z'}/>, are the values of <TeX math={'z'}/> for which <TeX math={'f(z)=0'}/>.  */}
            Find all the roots of a function <TeX math={"f(z)"} /> within a
            given circle in the complex plane. <TeX math={"f(z)"} /> must have
            no roots or poles on the circle and must be analytic within the
            circle.
          </Grid>
          <Grid size={12}>
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
          <Grid size={12}>Define the circle to find the roots in:</Grid>
          <Grid style={{ minWidth: "120px" }} size={4}>
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
          <Grid style={{ minWidth: "120px" }} size={4}>
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
          <Grid style={{ minWidth: "120px" }} size={4}>
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
            direction="column"
            alignItems="center"
            justifyContent="center"
            size={12}
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
            direction="column"
            alignItems="center"
            justifyContent="center"
            size={12}
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
