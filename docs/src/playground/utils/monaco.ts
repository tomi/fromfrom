// // (1) Desired editor features:
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js";
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
import "monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js";
import "monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector.js";
import "monaco-editor/esm/vs/editor/contrib/comment/comment.js";
import "monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js";
import "monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js";
import "monaco-editor/esm/vs/editor/contrib/dnd/dnd.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import "monaco-editor/esm/vs/editor/contrib/folding/folding.js";
import "monaco-editor/esm/vs/editor/contrib/hover/hover.js";
import "monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js";
import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js";
import "monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js";
import "monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOutline.js";

// // (2) Desired languages:
import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import "monaco-editor/esm/vs/language/json/monaco.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";

export * from "monaco-editor/esm/vs/editor/editor.api.js";

(window as any).MonacoEnvironment = {
  getWorkerUrl: function(moduleId: any, label: string) {
    if (label === "json") {
      return "./json.worker.bundle.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.bundle.js";
    }
    return "./editor.worker.bundle.js";
  },
};
