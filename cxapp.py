import dash
import dash_core_components as dcc
import dash_html_components as html

import cxroots
import numpy as np

from sympy import diff, lambdify
from sympy.parsing.sympy_parser import parse_expr, \
	standard_transformations, \
	implicit_multiplication_application, \
	convert_xor

app = dash.Dash()
server = app.server

app.layout = html.Div(children=[
    html.H1(children='cxroots online'),
    html.Div(children='''Find the roots of a complex analytic function within a circle of given radius R'''),
    html.Div([
    	html.Label('f(z) = '),
    	dcc.Input(id='finput', value='E^(z^2)sin(z)+z', placeholder='E^(z^2)sin(z)+z', type='text', size=100),
    ]),

    # dcc.Markdown(''' '''),
    # dcc.Dropdown(id='contour', options=[
	   #      {'label': 'Circle', 'value': 'Circle'},
	   #      {'label': 'Rectangle', 'value': 'Rectangle'},
	   #      {'label': 'Annulus', 'value': 'Annulus'},
	   #      {'label': 'Annulus Sector', 'value': 'AnnulusSector'}
	   #  ], value="AnnulusSector"),
	# html.Label('Circle center:'),
 #    dcc.Input(id='center', value=1.0, min=0, type='number', size=100),
    html.Div([
	html.Label('Circle radius = '),
    dcc.Input(id='radius', value=3, min=0, type='number', size=100),
    ]),

    html.Div([
    html.Label('Circle center = '),
    dcc.Input(id='center', value=0, min=0, type='number', size=100),
    ]),

    html.Div([
    	html.Button('Find the roots', id='button'),
    ]),

    dcc.Graph(
        id='rootplot',
        figure={}
    ),

], style = {'textAlign':'center'})

def hovertext(result):
	root, multiplicity = result
	return f'z = {root.real} + {root.imag} j  Multiplicity: {int(multiplicity)}'

@app.callback(
    dash.dependencies.Output('rootplot', 'figure'),
    [dash.dependencies.Input('button', 'n_clicks')],
    [dash.dependencies.State('finput', 'value'), 
     dash.dependencies.State('radius', 'value'),
     dash.dependencies.State('center', 'value')
    ])
def update_graph(n_clicks, function_string, circle_radius, circle_center):
	# Parse the input function string into a sympy expression and compute derivatives
	transformations = standard_transformations + (
		implicit_multiplication_application,
		convert_xor,
	)
	eq = parse_expr(function_string, transformations=transformations)
	deq = diff(eq, 'z')
	
	# convert sympy equations into python functions
	f  = lambdify('z', eq, modules='numpy')
	df = lambdify('z', deq, modules='numpy')

	# find the roots
	C = cxroots.Circle(float(circle_center), float(circle_radius))
	rootResult = C.roots(f, df)

	# get values to plot the contour
	conourVals = C(np.linspace(0,1,1001))

	figure = {
		'data': [
			{
				'x': np.real(conourVals), 
				'y': np.imag(conourVals),
				'mode': 'lines',
				'line': {'color':'black', 'dash':'dash'},
				'name': 'Initial contour',
				'hoverinfo': 'skip',
			}, 
			{
				'x': np.real(rootResult.roots), 
				'y': np.imag(rootResult.roots),
				'text': list(map(hovertext, zip(rootResult.roots, rootResult.multiplicities))),
				'type': 'scatter',
				'mode': 'markers',
				'name': 'Roots',
				'marker': {'color':'blue'},
				'hoverinfo': 'text',
			}
		],
		'layout': {
			'xaxis': {'title':'Re[z]'},
			'yaxis': {'title':'Im[z]', 'scaleanchor': 'x', 'scaleratio': 1},
			'hovermode': 'closest',
		}
	}

	return figure

if __name__ == '__main__':
    app.run_server(debug=True)


