import { h, Component, FunctionalComponent } from "preact";

export interface Example {
  name: string;
  code: string;
}

export interface PlaygroundExampleSelectorProps {
  examples: Example[];
  selectedExample: Example;
  onExampleSelected: (example: Example) => void;
}

export class PlaygroundExampleSelector extends Component<
  PlaygroundExampleSelectorProps
> {
  render() {
    return (
      <div class="playground-examples">
        {this.props.examples.map(example => (
          <ExampleButton
            isSelected={example === this.props.selectedExample}
            text={example.name}
            onClick={() => this.props.onExampleSelected(example)}
          />
        ))}
      </div>
    );
  }
}

interface ExampleButtonProps {
  isSelected: boolean;
  text: string;
  onClick: () => void;
}

const ExampleButton: FunctionalComponent<ExampleButtonProps> = ({
  text,
  onClick,
  isSelected,
}) => (
  <div
    class={`playgroung-example-button ${
      isSelected ? "playgroung-example-button--selected" : ""
    }`}
  >
    <a href="#" onClick={onClick}>
      {text}
    </a>
  </div>
);
