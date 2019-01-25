const path = require("path");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./playground/index.js",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "json.worker": "monaco-editor/esm/vs/language/json/json.worker",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker"
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "playground-dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.d\.ts$/,
        use: [
          {
            loader: "raw-loader",
            options: {}
          }
        ]
      }
    ]
  }
  // plugins: [new UglifyJSPlugin()]
};
