import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserContext from "root/context/UserContext";
import { GuardedRoute } from "root/components";
import Login from "./Login";
import Search from "./Search";

import "./App.css";

function App() {
  const [user, setUser] = useState({ name: "", accessToken: null, plan: null });
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="App">
          <h1>Star Wars</h1>
          <Switch>
            <Route path="/login" component={Login} exact />
            <GuardedRoute path="/search" component={Search} exact />
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route render={() => <h2>404</h2>} />
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
