import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Join from "./components/Join";
import Call from "./components/Call";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Call />
        </Route>
        <Route path="/join/:meetingId">
          <Join />
        </Route>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
