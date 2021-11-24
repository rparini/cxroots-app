import { useState } from "react";
import script from "./python/main.py";
import logo from "./logo.svg";
import "./App.css";

const runCxroots = async (python_args) => {
  const scriptText = await (await fetch(script)).text();

  const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
  });
  // Packages in https://github.com/pyodide/pyodide/tree/main/packages
  await pyodide.loadPackage(["micropip", "numpy", "scipy"]);

  // Set keys on self, so that `from js import key` works.
  window.self["cxroots_args"] = python_args;

  return await pyodide.runPythonAsync(scriptText);
};

const App = () => {
  const [output, setOutput] = useState("(Click the button!)");
  const [functionText, setFunctionText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(functionText);
    setOutput("(Loading ... )");
    const out = await runCxroots({ foo: functionText });
    setOutput(out);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              onChange={(event) => setFunctionText(event.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>f(x)={functionText}</p>
        <p>Result = {output}</p>
      </header>
    </div>
  );
};

export default App;
