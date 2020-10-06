
import React from 'react';
import './App.css';
import Routes from './Routes'
import { BrowserRouter } from 'react-router-dom';
import Layout from './HOC/Layout/Layout'
function App() {
  return (
    <BrowserRouter>
    <Layout/>
     <Routes/>
    </BrowserRouter>
    // <Login/>
  );
}

export default App;
