import React from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

export function CxPlot({roots, multiplicities, contour}) {
    console.log('multi plot', multiplicities)
    
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
            // This removes the "trace 0" from appearing on hoverover
            '<extra></extra>',
            marker: {color: 'black'},
          },
        ]}
        layout={{
          autosize: false, 
          title: 'A Fancy Plot', 
          yaxis: {scaleanchor: "x", scaleratio: 1},
          shapes: [
            {
              type: 'circle', 
              line: {dash: "dash"},
              x0: math.re(contour.center) - contour.radius, 
              x1: math.re(contour.center) + contour.radius,
              y0: math.im(contour.center) - contour.radius,
              y1: math.im(contour.center) + contour.radius
            }
          ]
        }}
      />
    );
}
