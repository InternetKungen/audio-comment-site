// import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Main from "./layout/Main/Main";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import { AudioProvider } from "./AudioContext";
import { BackgroundProvider } from "./BackgroundContext";

function App() {
  return (
    <AudioProvider>
      <div className="app">
        <Router>
          <BackgroundProvider>
            <Header />
            <Main />
            <Footer />
          </BackgroundProvider>
        </Router>
      </div>
    </AudioProvider>
  );
}

export default App;
