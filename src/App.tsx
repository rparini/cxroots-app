import * as React from "react"
import * as workerPath from "file-loader?name=[name].js!./cxroots.worker"

const worker = new Worker(workerPath)

export class App extends React.Component<{}, { status: string , result: string}> {
  constructor(props) {
    super(props)
    this.state = {status: "Fresh", result: null}

    // This binding is necessary to make `this` work in the callback
    this.findRoots = this.findRoots.bind(this);
  }

  findRoots() {
    this.setState({status: "Running"})
    worker.postMessage({f: '2'})
    worker.addEventListener('message', message => {
      console.log('message returned:')
      console.log(message)
      this.setState({status: "Finished", result: message.data})
    })
  }

  public render() {
    return (
      <div className="App">
        <h1>Hello there!</h1>
        <Button onClick={this.findRoots} />
        <Results status={this.state.status} />
        The answer is: {this.state.result}
      </div>
    )
  }
}

class Button extends React.Component<{onClick: any}, {}> {
  render() {
    return (
      <button onClick={this.props.onClick}>
        Run
      </button>
    );
  }
}

class Results extends React.Component<{'status':string}, {}> {
  public render() {
    return <h3>The status is: {this.props.status}</h3>
  }
}

