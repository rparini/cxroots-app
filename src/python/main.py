import micropip

# Think this gets redownloaded every time this script is run
await micropip.install([
    'https://files.pythonhosted.org/packages/62/2a/31e70724b12d7ddf776960c219219f5035f2cf21e2f3e132f584b513e200/cxroots-1.1.10-py3-none-any.whl',
    'https://files.pythonhosted.org/packages/ab/c0/b0d967160ecc8db52ae34e063937d85e8d386f140ad4826aae2086245a5e/numdifftools-0.9.39-py2.py3-none-any.whl',
    'https://files.pythonhosted.org/packages/60/1d/9e398c53d6ae27d5ab312ddc16a9ffe1bee0dfdf1d6ec88c40b0ca97582e/numpydoc-1.1.0-py3-none-any.whl',
])

import cxroots
from js import cxroots_args


def cxroots_args(foo):
    return foo

cxroots_args(**cxroots_args)