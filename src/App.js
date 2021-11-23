import { useEffect, useState } from "react";
import script from "./python/main.py";
import logo from "./logo.svg";
import "./App.css";

const runScript = async (code) => {
  const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
  });
  // Packages in https://github.com/pyodide/pyodide/tree/main/packages
  await pyodide.loadPackage(["micropip", "numpy", "scipy"]);

  // Set keys on self, so that `from js import key` works.
  window.self["cxroots_args"] = { foo: "bar" };

  return await pyodide.runPythonAsync(code);
};

const App = () => {
  const [output, setOutput] = useState("(loading...)");

  useEffect(() => {
    const run = async () => {
      const scriptText = await (await fetch(script)).text();
      const out = await runScript(scriptText);
      setOutput(out);
    };
    run();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>5 + 7 = {output}</p>
      </header>
    </div>
  );
};

export default App;
