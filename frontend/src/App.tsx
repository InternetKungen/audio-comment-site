// import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Main from "./layout/Main/Main";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import { AudioProvider } from "./AudioContext";

function App() {
  return (
    <AudioProvider>
      <div className="app">
        <Router>
          <Header />
          <Main />
          <Footer />
        </Router>
      </div>
    </AudioProvider>
  );
}

export default App;
