import React from "react";
import ReactDom from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Create from "./components/Create";
import Join from "./components/Join";

import "./style.css";

const App = () => (
  <Router>
    <Switch>
      <Route path="/create">
        <Create />
      </Route>
      <Route path="/join/:meetingId">
        <Join />
      </Route>
      <Route path="/" exact>
        <Redirect to="/create" />
      </Route>
    </Switch>
  </Router>
);

ReactDom.render(<App />, document.getElementById("react-app"));
