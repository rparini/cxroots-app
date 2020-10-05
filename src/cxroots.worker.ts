
console.log('Loading pyodide')
importScripts("pyodide.js");
console.log('Loaded pyodide')

declare var languagePluginLoader: Promise<any>;
declare var pyodide: {
    runPython(python: string): string;
    runPythonAsync(python: string): Promise<string>;
    pyimport<T>(variableName: string): T;
    loadPackage(package: string | string[]): Promise<void>;
};

const pythonCode = `
import micropip
def do_work(*args):
    import cxroots
    print('Imported cxroots')
    return 42 # This gets returned by pyodide.runPython
micropip.install([
    'https://files.pythonhosted.org/packages/62/2a/31e70724b12d7ddf776960c219219f5035f2cf21e2f3e132f584b513e200/cxroots-1.1.10-py3-none-any.whl',
    'https://files.pythonhosted.org/packages/ab/c0/b0d967160ecc8db52ae34e063937d85e8d386f140ad4826aae2086245a5e/numdifftools-0.9.39-py2.py3-none-any.whl',
    'https://files.pythonhosted.org/packages/60/1d/9e398c53d6ae27d5ab312ddc16a9ffe1bee0dfdf1d6ec88c40b0ca97582e/numpydoc-1.1.0-py3-none-any.whl',
]).then(do_work)
`

async function runCxroots(): Promise<any> {
    await languagePluginLoader;
    await pyodide.loadPackage(['micropip', 'numpy', 'scipy']);
    return pyodide.runPython(pythonCode);
}

addEventListener('message', async (message) => {
    console.log('in webworker', message);
    var result = await runCxroots();
    postMessage('this is the response ' + message.data + ' result: ' + result);
});
