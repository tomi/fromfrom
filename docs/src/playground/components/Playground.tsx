import "./Playground.css";
import { h, Component } from "preact";
import { PlaygroundEditors } from "./PlaygroundEditors";
import {
  PlaygroundExampleSelector,
  Example,
} from "./PlaygroundExampleSelector";

const examples: Example[] = [
  {
    name: "SortBy",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .filter(u => u.country === "FI")
  .sortByDescending(u => u.score)
  .pick("id", "first_name", "gender", "score")
  .take(5)
  .toArray();
`,
  },
  {
    name: "GroupBy",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .groupBy(u => u.country)
  .toObject(
    group => group.key,
    group => group.items
  );
`,
  },
];

interface PlaygroundState {
  selected: Example;
}

export class Playground extends Component<{}, PlaygroundState> {
  constructor(props: {}) {
    super(props);

    this.state = { selected: examples[0] };

    this.onExampleSelected = this.onExampleSelected.bind(this);
  }

  onExampleSelected(example: Example) {
    this.setState(() => ({
      selected: example,
    }));
  }

  render() {
    return (
      <div class="playground">
        <PlaygroundExampleSelector
          examples={examples}
          selectedExample={this.state.selected}
          onExampleSelected={this.onExampleSelected}
        />
        <PlaygroundEditors example={this.state.selected} />
      </div>
    );
  }
}
