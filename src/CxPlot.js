import React from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

export function CxPlot({roots, multiplicities}) {
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
        layout={{autosize: true, title: 'A Fancy Plot'}}
      />
    );
}
