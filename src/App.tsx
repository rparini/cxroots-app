import * as React from "react";
import * as workerPath from "file-loader?name=[name].js!./cxroots.worker";

const worker = new Worker(workerPath);

export class App extends React.Component<
  {},
  { status: string; inputFunction: string; result: string }
> {
  constructor(props) {
    super(props);
    this.state = { status: "Fresh", inputFunction: null, result: null };

    // This binding is necessary to make `this` work in the callback
    this.findRoots = this.findRoots.bind(this);
  }

  findRoots(args: object) {
    this.setState({ status: "Running" });
    worker.postMessage(args);
    worker.addEventListener("message", (message) => {
      console.log("message returned:");
      console.log(message);
      this.setState({ status: "Finished", result: message.data });
    });
  }

  public render() {
    return (
      <div className="App">
        <h1>Hello there!</h1>
        <RootFindingForm onSubmit={this.findRoots} />
        <Results status={this.state.status} />
        The answer is: {this.state.result}
      </div>
    );
  }
}

class RootFindingForm extends React.Component<
  { onSubmit: any },
  { targetFunc: string }
> {
  constructor(props) {
    super(props);
    this.state = { targetFunc: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ targetFunc: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault(); // To prevent page from refreshing on submit
    this.props.onSubmit({ f: this.state.targetFunc });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          f(x):
          <input
            type="text"
            value={this.state.targetFunc}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="x2" />
      </form>
    );
  }
}

class Results extends React.Component<{ status: string }, {}> {
  public render() {
    return <h3>The status is: {this.props.status}</h3>;
  }
}
