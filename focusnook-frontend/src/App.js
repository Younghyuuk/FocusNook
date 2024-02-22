import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';

function App() {
  return (
    <Router>
        
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/SignUp" element={<SignUp/>} />
      <Route path="/Home" element={<Home/>} />
    </Routes>
  </Router>
  );
}

export default App;
