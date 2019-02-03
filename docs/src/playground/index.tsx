import { h, render, Component } from "preact";
import { Playground } from "./components/Playground";

interface AppState {
  Playground: any | undefined;
}

class App extends Component<{}, AppState> {
  render() {
    return <Playground />;
  }
}

render(<App />, document.getElementById("app")!);
