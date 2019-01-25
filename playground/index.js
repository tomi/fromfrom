import "./main.css";
import * as monaco from "monaco-editor";
import { from } from "../dist/seqenum.es5";
import * as typings from "../dist/types/seqenum.d.ts";
import data from "./data.json";

console.log(typings.replace(/export/g, ""));

// compiler options
// monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
//   target: monaco.languages.typescript.ScriptTarget.ES6,
//   allowJs: true
// });

monaco.languages.typescript.javascriptDefaults.addExtraLib(typings.replace(/export/g, ""));

self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === "json") {
      return "./json.worker.bundle.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.bundle.js";
    }
    return "./editor.worker.bundle.js";
  }
};

const dataEditor = monaco.editor.create(document.getElementById("playground-input-data"), {
  value: JSON.stringify(data, null, 2),
  language: "json",
  autoIndent: true,
  codeLens: false,
  minimap: {
    enabled: false
  }
});

const codeEditor = monaco.editor.create(document.getElementById("playground-input-code"), {
  value: `from(data)
  .toArray();
`,
  language: "javascript",
  minimap: {
    enabled: false
  }
});

dataEditor.getModel().onDidChangeContent(onInputChanged);
codeEditor.getModel().onDidChangeContent(onInputChanged);
// codeEditor.onDidChangeContent(onInputChanged);
// dataEditor.onDidChangeContent(onInputChanged);

// function init() {
//   const inputDataField = document.getElementById("playground-input-data");
//   const inputCodeField = document.getElementById("playground-input-code");
const outputField = document.getElementById("playground-output");

window.from = from;

function onInputChanged() {
  console.log("changed");
  try {
    const inputData = JSON.parse(dataEditor.getValue());
    window.data = inputData;
    const output = eval(codeEditor.getValue());

    outputField.value = formatOutput(output);
  } catch (error) {
    outputField.value = error.message;
  }
}

function formatOutput(output) {
  if (output instanceof Map) {
    return formatMap(output);
  } else if (output instanceof Set) {
  } else {
    return JSON.stringify(output, null, 2);
  }
}

function formatMap(map) {
  const items = Array.from(map.entries())
    .map(item => `  ${JSON.stringify(item[0], null, 2)} --> ${JSON.stringify(item[1], null, 4)},`)
    .join("\n");

  return `Map(${map.size}) {\n${items}\n}`;
}

//   inputDataField.oninput = onInputChanged;
//   inputCodeField.oninput = onInputChanged;

//   onInputChanged();
// }

window.onload = onInputChanged;
