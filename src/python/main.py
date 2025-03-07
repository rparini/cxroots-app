import micropip


# These are packages that aren't bundled with pyodide so have to be installed from pypi
# The packages only seem to be loaded the first time the script is run
await micropip.install(
    [
        "cxroots==3.1.0",
        "numpydoc==1.1.0",
    ]
)

from typing import Union

from js import cxroots_args
from sympy import diff, lambdify
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor,
)

import cxroots


def run_cxroots(function_string: str, circle_center, circle_radius: Union[float, int]):
    # Parse the input function string into a sympy expression and compute derivatives
    transformations = standard_transformations + (
        implicit_multiplication_application,
        convert_xor,
    )
    eq = parse_expr(function_string, transformations=transformations)
    eq = eq.subs("i", 1j)
    deq = diff(eq, "z")

    # convert sympy equations into python functions
    f = lambdify("z", eq, modules="numpy")
    df = lambdify("z", deq, modules="numpy")

    # find the roots
    circle_center = complex(str(circle_center).replace("i", "j").replace(" ", ""))
    C = cxroots.Circle(circle_center, circle_radius)
    root_result = C.roots(f, df, int_method="romb")
    return {"roots": root_result.roots, "multiplicities": root_result.multiplicities}


run_cxroots(**cxroots_args.to_py())
