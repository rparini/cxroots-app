import React from "react";
import Plot from "react-plotly.js";
import * as Plotly from "plotly.js";
import { create, all } from "mathjs";

const math = create(all);

export interface Contour {
  type: string;
  centerRe: number;
  centerIm: number;
  radius: number;
}

export function CxPlot({
  functionText,
  roots,
  multiplicities,
  contour,
  previewContour,
}: {
  functionText: string;
  roots: math.Complex[];
  multiplicities: number[];
  contour: Contour;
  previewContour: Contour;
}) {
  const data: Plotly.Data[] = [
    {
      x: roots.map((z) => z.re),
      y: roots.map((z) => z.im),
      text: multiplicities.map(String),
      type: "scatter",
      mode: "markers",
      hovertemplate:
        "Root: %{x}%{y:+}i" +
        "<br>Multiplicity: %{text}" +
        // The <extra></extra> removes the "trace 0" from appearing on hoverover
        "<extra></extra>",
      marker: { color: "blue" },
    },
  ];
  let shapes: Partial<Plotly.Shape>[] = [
    {
      type: "circle",
      line: { dash: "dash", color: "rgba(0,0,0,0.2)" },
      x0: previewContour.centerRe - previewContour.radius,
      x1: previewContour.centerRe + previewContour.radius,
      y0: previewContour.centerIm - previewContour.radius,
      y1: previewContour.centerIm + previewContour.radius,
    },
  ];
  if (contour !== undefined) {
    shapes.push({
      type: "circle",
      line: { dash: "dash", color: "black" },
      x0: contour.centerRe - contour.radius,
      x1: contour.centerRe + contour.radius,
      y0: contour.centerIm - contour.radius,
      y1: contour.centerIm + contour.radius,
    });
  }
  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    title:
      functionText === undefined
        ? ""
        : "$\\text{Roots of }" + functionText + "$",
    xaxis: {
      scaleanchor: "y",
      scaleratio: 1,
      title: { text: "$\\text{Re}[z]$" },
    },
    yaxis: { scaleratio: 1, title: { text: "$\\text{Im}[z]$" } },
    shapes: shapes,
  };

  return (
    <Plot
      data={data}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      layout={layout}
    />
  );
}
