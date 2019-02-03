import "./introduction.css";
// @ts-ignore
import hljs from "highlight.js/lib/highlight";
// @ts-ignore
import typescript from "highlight.js/lib/languages/typescript";
hljs.registerLanguage("typescript", typescript);
hljs.initHighlightingOnLoad();

import "highlight.js/styles/tomorrow-night.css";
