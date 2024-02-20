import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

function App() {
  return (
    <Router>
        
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/SignUp" element={<SignUp/>} />
    </Routes>
  </Router>
  );
}

export default App;
