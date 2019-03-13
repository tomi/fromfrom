import { h, Component } from "preact";
import * as monaco from "../utils/monaco";
// @ts-ignore
import typings from "raw-loader!../../fromfrom.d.ts";
import data from "../utils/data.json";
import { debounce } from "../utils/debounce";
import { Example } from "./PlaygroundExampleSelector";
import { executeCode } from "../utils/example-evaluator";

const editorDefaults = {
  fontFamily: `monospace, "Lucida Console", Monaco`,
  fontSize: 14,
  minimap: {
    enabled: false,
  },
};

monaco.languages.typescript.typescriptDefaults.addExtraLib(
  typings,
  "fromfrom.d.ts"
);

export interface PlaygroundEditorsProps {
  example: Example;
}

export class PlaygroundEditors extends Component<PlaygroundEditorsProps> {
  private dataEditor!: monaco.editor.IStandaloneCodeEditor;
  private codeEditor!: monaco.editor.IStandaloneCodeEditor;
  private outputEditor!: monaco.editor.IStandaloneCodeEditor;

  private codeModel!: monaco.editor.ITextModel;
  private dataModel!: monaco.editor.ITextModel;

  constructor(props: PlaygroundEditorsProps) {
    super(props);

    this.onResize = this.onResize.bind(this);
  }

  componentWillReceiveProps(props: PlaygroundEditorsProps) {
    this.codeModel.setValue(props.example.code);
  }

  shouldComponentUpdate() {
    return false;
  }

  onDataChanged() {
    this.dataModel.setValue(formatDataModule(this.dataEditor.getValue()));

    this.setOutput();
  }

  onResize() {
    if (this.codeEditor) {
      this.codeEditor.layout();
      this.dataEditor.layout();
      this.outputEditor.layout();
    }
  }

  getOutput(): string {
    return executeCode(this.dataEditor.getValue(), this.codeEditor.getValue());
  }

  setOutput() {
    this.outputEditor.setValue(this.getOutput());
  }

  setCode(code: string) {
    this.codeModel.setValue(code);
  }

  componentDidMount() {
    window.onresize = debounce(this.onResize, 50);

    this.dataEditor = monaco.editor.create(
      document.getElementById("playground-input-data")!,
      {
        ...editorDefaults,
        value: JSON.stringify(data, null, 2),
        language: "json",
      }
    );

    this.dataModel = monaco.editor.createModel(
      formatDataModule(JSON.stringify(data, null, 2)),
      "typescript",
      monaco.Uri.file("data.ts")
    );

    this.codeModel = monaco.editor.createModel(
      this.props.example.code,
      "typescript",
      monaco.Uri.file("code.ts")
    );

    this.codeEditor = monaco.editor.create(
      document.getElementById("playground-input-code")!,
      {
        ...editorDefaults,
        model: this.codeModel,
      }
    );

    this.outputEditor = monaco.editor.create(
      document.getElementById("playground-output")!,
      {
        ...editorDefaults,
        language: "json",
        readOnly: true,
        value: this.getOutput(),
      }
    );

    this.codeEditor.getModel().onDidChangeContent(() => this.setOutput());
    this.dataEditor.getModel().onDidChangeContent(() => this.onDataChanged());

    this.onResize();
  }

  render() {
    return (
      <div class="playground-editors">
        <div class="playground-column">
          <div class="editor-heading">Code</div>
          <div id="playground-input-code" class="playground-editor" />

          <div class="editor-heading">Data</div>
          <div id="playground-input-data" class="playground-editor" />
        </div>

        <div class="playground-column">
          <div class="editor-heading">Output</div>
          <div id="playground-output" class="playground-editor" />
        </div>
      </div>
    );
  }
}

function formatDataModule(dataString: string) {
  return `export default ${dataString}`;
}
