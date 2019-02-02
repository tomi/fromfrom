const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const outputDir = path.resolve(__dirname, "..", "dist-docs");

module.exports = {
  context: path.resolve(__dirname),
  mode: "development",
  entry: {
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
    extensions: [".tsx", ".ts", ".js"],
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
    new HtmlWebpackPlugin({
      template: "./playground.html",
      filename: "playground.html",
    }),
    new CopyWebpackPlugin([{ from: "styles/styles.css", to: "../dist-docs" }]),
  ],
};
