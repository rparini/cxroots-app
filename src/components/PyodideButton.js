import { useState } from "react";
import { LoadingButton } from "@mui/lab";

const pyodideURL = "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/";

function loadScript(url) {
  return new Promise(function (resolve, reject) {
    let script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

const loadPyodide = async () => {
  await loadScript(pyodideURL + "pyodide.js");
  const pyodide = await window.loadPyodide({
    indexURL: pyodideURL,
  });
  // Packages in https://github.com/pyodide/pyodide/tree/main/packages
  await pyodide.loadPackage(["micropip", "numpy", "scipy", "sympy"]);
  return pyodide;
};

/**
 * PyodideButton loads pyodide before being clickable and does
 * not allow the button to be clicked while pyodide is running
 */
export const PyodideButton = ({ disabled, onClick }) => {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(false);

  if (pyodide == null) {
    setPyodide("loading");
    setLoading(true);
    loadPyodide()
      .then(setPyodide)
      .then(() => setLoading(false));
  }

  const onClickLoading = async (event) => {
    setLoading(true);
    await onClick(event, pyodide);
    setLoading(false);
  };

  return (
    <LoadingButton
      loading={loading}
      disabled={disabled}
      variant="contained"
      onClick={onClickLoading}
    >
      Find the Roots
    </LoadingButton>
  );
};
