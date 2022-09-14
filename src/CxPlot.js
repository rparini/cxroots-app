import React from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';

const math = create(all)

export function CxPlot({functionText, roots, multiplicities, contour, previewContour}) {
    return (
      <Plot
        data={[
          {
            x: math.re(roots),
            y: math.im(roots),
            text: multiplicities,
            type: 'scatter',
            mode: 'markers',
            hovertemplate: 'Root: %{x}%{y:+}i' +
            '<br>Multiplicity: %{text}' + 
            // The <extra></extra> removes the "trace 0" from appearing on hoverover
            '<extra></extra>',
            marker: {color: 'blue'},
          },
        ]}
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
        layout={{
          autosize: true, 
          title: functionText === undefined ? '' : '$\\text{Roots of }' + functionText + '$', 
          xaxis: {scaleanchor: "y", scaleratio: 1, title:{text:'$\\text{Re}[z]$'}},
          yaxis: {scaleratio: 1, title:{text:'$\\text{Im}[z]$'}},
          shapes: [
            contour === undefined ? undefined : {
              type: 'circle', 
              line: {dash: "dash"},
              x0: contour.centerRe - contour.radius, 
              x1: contour.centerRe + contour.radius,
              y0: contour.centerIm - contour.radius,
              y1: contour.centerIm + contour.radius
            },
            {
              type: 'circle',
              line: {dash: "dash", color: 'rgba(0,0,0,0.2)'},
              x0: previewContour.centerRe - previewContour.radius, 
              x1: previewContour.centerRe + previewContour.radius,
              y0: previewContour.centerIm - previewContour.radius,
              y1: previewContour.centerIm + previewContour.radius
            },            
          ]
        }}
      />
    );
}
