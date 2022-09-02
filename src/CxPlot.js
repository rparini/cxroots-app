import React from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';

const config = { }
const math = create(all, config)

export function CxPlot({functionText, roots, multiplicities, contour, previewContour}) {
    console.log(previewContour)
    console.log(functionText)
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
        layout={{
          autosize: true, 
          title: functionText === undefined ? '' : '$\\text{Roots of }' + functionText + '$', 
          xaxis: {scaleanchor: "y", scaleratio: 1, title:{text:'$\\text{Re}[z]$'}},
          yaxis: {scaleratio: 1, title:{text:'$\\text{Im}[z]$'}},
          shapes: [
            contour === undefined ? undefined : {
              type: 'circle', 
              line: {dash: "dash"},
              x0: math.re(contour.center) - contour.radius, 
              x1: math.re(contour.center) + contour.radius,
              y0: math.im(contour.center) - contour.radius,
              y1: math.im(contour.center) + contour.radius
            },
            {
              type: 'circle',
              line: {dash: "dash", color: 'rgba(0,0,0,0.2)'},
              x0: math.re(previewContour.center) - previewContour.radius, 
              x1: math.re(previewContour.center) + previewContour.radius,
              y0: math.im(previewContour.center) - previewContour.radius,
              y1: math.im(previewContour.center) + previewContour.radius
            },            
          ]
        }}
      />
    );
}
