import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Create from "./components/Create";
import Join from "./components/Join";

function App() {
  return (
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
}

export default App;
