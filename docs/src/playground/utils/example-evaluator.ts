// @ts-ignore
import { from } from "../../../../dist/fromfrom.es5";

// expose from globally
(window as any).from = from;

export function executeCode(data: string, code: string) {
  try {
    let inputData = JSON.parse(data);
    (window as any).data = inputData;
    let codeToExecute = code
      .replace(/import { from } from "fromfrom";/, "")
      .replace(/import data from "data";/, "");
    let output = new Function("data", "return " + codeToExecute.trim())(
      inputData
    );
    return formatOutput(output);
  } catch (error) {
    return formatOutput(error.message);
  }
}
function formatOutput(output: any) {
  if (output instanceof Map) {
    return formatMap(output);
  } else if (output instanceof Set) {
    return formatSet(output);
  } else {
    return JSON.stringify(output, null, 2);
  }
}

function formatSet(set: Set<any>) {
  console.log(set);
  const items = Array.from(set.values())
    .map(item =>
      JSON.stringify(item, null, 2)
        .split("\n")
        .map(l => `  ${l}`)
        .join("\n")
    )
    .join(",\n");

  return "Set(" + set.size + ") {\n" + items + "\n}";
}

function formatMap(map: Map<any, any>) {
  const items = Array.from(map.entries())
    .map(function(item) {
      return (
        JSON.stringify(item[0], null, 2)
          .split("\n")
          .map(l => `  ${l}`)
          .join("\n") +
        " --> " +
        JSON.stringify(item[1], null, 2)
          .split("\n")
          .map((l, idx) => (idx === 0 ? l : `  ${l}`))
          .join("\n")
      );
    })
    .join(",\n");

  return "Map(" + map.size + ") {\n" + items + "\n}";
}
