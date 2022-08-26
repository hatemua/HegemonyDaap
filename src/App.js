import { BrowserRouter as Router, Route } from "react-router-dom";
import Mint from "./Mint"
function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Mint} />
       
      </Router>
    </div>
  );
}

export default App;
