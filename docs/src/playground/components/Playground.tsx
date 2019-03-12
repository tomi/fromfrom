import "./Playground.css";
import { h, Component } from "preact";
import { PlaygroundEditors } from "./PlaygroundEditors";
import {
  PlaygroundExampleSelector,
  Example,
} from "./PlaygroundExampleSelector";

const examples: Example[] = [
  {
    name: "find",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .find(u => u.country === "FI" && u.score > 1000);
`,
  },
  {
    name: "first",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .first();
`,
  },
  {
    name: "every",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .every(u => u.score > 1000);
`,
  },
  {
    name: "groupBy",
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
  {
    name: "last",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .last();
`,
  },
  {
    name: "pick",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .pick("id", "email", "country", "score")
  .toArray();
`,
  },
  {
    name: "some",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .some(u => u.score > 1000);
`,
  },
  {
    name: "sortBy",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .pick("country", "score")
  .sortBy(u => u.country)
  .thenByDescending(u => u.score)
  .toArray();
`,
  },
  {
    name: "toObject",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .toObject(u => u.id);
`,
  },
  {
    name: "toSet",
    code: `import { from } from "fromfrom";
import data from "data";

from(data)
  .map(u => u.country)
  .toSet();
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
