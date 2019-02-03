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
    return "TODO";
  } else {
    return JSON.stringify(output, null, 2);
  }
}
function formatMap(map: Map<any, any>) {
  let items = Array.from(map.entries())
    .map(function(item) {
      return (
        "  " +
        JSON.stringify(item[0], null, 2) +
        " --> " +
        JSON.stringify(item[1], null, 4) +
        ","
      );
    })
    .join("\n");
  return "Map(" + map.size + ") {\n" + items + "\n}";
}
