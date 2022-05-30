import './App.css';
import Mint from './Mint'
import AddEvent from './AddEvent'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
function App() {
  return (
    <div className="App">
	  <Router>

		
        <Route path="/" component={Mint} exact/>
        <Route path="/AddEvent" component={AddEvent} />
           
	  </Router>
  
    </div>
  );
}

export default App;
