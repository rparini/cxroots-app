import micropip


# Think this gets redownloaded every time this script is run
await micropip.install(
    [
        "https://files.pythonhosted.org/packages/97/fa/29467f8cbd3c1f8e687419fa6c2d3f8dc48308fd5a3ff2b4f221af3b1ea2/cxroots-2.0.0-py3-none-any.whl",
        "https://files.pythonhosted.org/packages/ab/c0/b0d967160ecc8db52ae34e063937d85e8d386f140ad4826aae2086245a5e/numdifftools-0.9.39-py2.py3-none-any.whl",
        "https://files.pythonhosted.org/packages/60/1d/9e398c53d6ae27d5ab312ddc16a9ffe1bee0dfdf1d6ec88c40b0ca97582e/numpydoc-1.1.0-py3-none-any.whl",
    ]
)

from js import cxroots_args
from sympy import diff, lambdify
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor,
)

import cxroots


def run_cxroots(function_string, circle_center, circle_radius):
    print("function_string", function_string)
    print("circle_center", circle_center, type(circle_center))
    print("circle_radius", circle_radius)

    # Parse the input function string into a sympy expression and compute derivatives
    transformations = standard_transformations + (
        implicit_multiplication_application,
        convert_xor,
    )
    eq = parse_expr(function_string, transformations=transformations)
    deq = diff(eq, "z")

    # convert sympy equations into python functions
    f = lambdify("z", eq, modules="numpy")
    df = lambdify("z", deq, modules="numpy")

    # find the roots
    circle_center = complex(str(circle_center).replace("i", "j"))
    C = cxroots.Circle(circle_center, float(circle_radius))
    root_result = C.roots(f, df, int_method="romb")

    print("py roots", root_result.roots)
    print("py multiplicities", root_result.multiplicities)

    roots = {"roots": root_result.roots, "multiplicities": root_result.multiplicities}

    return roots


run_cxroots(**cxroots_args.to_py())
