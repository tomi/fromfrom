const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const outputDir = path.resolve(__dirname, "..", "dist-docs");

module.exports = {
  context: path.resolve(__dirname),
  mode: "development",
  entry: {
    index: "./src/introduction/index.ts",
    playground: "./src/playground/index.tsx",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "json.worker": "monaco-editor/esm/vs/language/json/json.worker",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: outputDir,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules|\.d\.ts$/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "styles/*", to: "../dist-docs" },
      { from: "index.html", to: "../dist-docs" },
      { from: "playground.html", to: "../dist-docs" },
    ]),
  ],
};
