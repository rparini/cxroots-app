import micropip

# Think this gets redownloaded every time this script is run
await micropip.install(
    [
        "https://files.pythonhosted.org/packages/b8/7f/8438a7fd42b7180db5d968057fcff1cbd4a43c5ecfb95b9232fa4c46263c/cxroots-1.1.11-py3-none-any.whl",
        "https://files.pythonhosted.org/packages/ab/c0/b0d967160ecc8db52ae34e063937d85e8d386f140ad4826aae2086245a5e/numdifftools-0.9.39-py2.py3-none-any.whl",
        "https://files.pythonhosted.org/packages/60/1d/9e398c53d6ae27d5ab312ddc16a9ffe1bee0dfdf1d6ec88c40b0ca97582e/numpydoc-1.1.0-py3-none-any.whl",
    ]
)

import cxroots
from js import cxroots_args


def run_cxroots(foo):
    return foo


run_cxroots(**cxroots_args.to_py())
