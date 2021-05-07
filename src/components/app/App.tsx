import history from "components/history/History";
import Quiz from "components/quiz/Quiz";
import { HashRouter, Redirect, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <HashRouter>
          <Route path="/" exact>
            <Redirect to="/quiz" />
          </Route>
          <Route path="/quiz" component={Quiz} />
          <Route path="/history" component={history} />
        </HashRouter>
      </div>
    </div>
  );
}

export default App;
