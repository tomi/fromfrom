import { h, render, Component } from "preact";
import { Playground } from "./components/Playground";

interface AppState {
  Playground: any | undefined;
}

class App extends Component<{}, AppState> {
  render() {
    return (
      <main class="content">
        <Playground />
      </main>
    );
  }
}

render(<App />, document.getElementById("app")!);
