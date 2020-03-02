import React, { Suspense } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./navbar";
const Home = React.lazy(() => import("./components/Home"));
const Dev = React.lazy(() => import("./components/Dev"));
const loading = () => (
  <center>
    <div className="animated fadeIn pt-3 text-center">Loading...</div>
  </center>
);
class App extends React.Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Navbar />
          <div className="container-custom">
            <Suspense fallback={loading()}>
              <Switch>
                <Route path="/dev" component={Dev} />
                <Route exact path="/" component={Home} />
              </Switch>
            </Suspense>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
