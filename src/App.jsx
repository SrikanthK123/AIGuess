
import './App.css'
import AIGuess from './components/AIGuess';
//import Home from './components/Home'
import {
  BrowserRouter as Router,
  
  Route,
  Routes
} from "react-router-dom";

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/AIGuess" element={<AIGuess/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
