
import React from 'react';
import './App.css';
import Routes from './Routes'
import { BrowserRouter } from 'react-router-dom';
import Login from './components/Login/Login'
function App() {
  return (
    <BrowserRouter>
     <Routes/>
    </BrowserRouter>
    // <Login/>
  );
}

export default App;
