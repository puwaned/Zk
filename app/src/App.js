import React, { Suspense } from "react";

class App extends React.Component {
  componentDidMount() {
    fetch("http://127.0.0.1:5000/get")
      .then(res => res.json())
      .then(res => {
        console.log(res);
      });
  }

  render() {
    return (
      <div>
        <p>Hello</p>
      </div>
    );
  }
}

export default App;
