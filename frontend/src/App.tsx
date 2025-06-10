// import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Main from "./layout/Main/Main";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import { AudioProvider } from "./AudioContext";
import { BackgroundProvider } from "./BackgroundContext";
import BackgroundImage from "./components/BackgroundImage/BackgroundImage";

function App() {
  return (
    <BackgroundProvider>
      <AudioProvider>
        <div className="app">
          <Router>
            <BackgroundImage />
            <Header />
            <Main />
            <Footer />
          </Router>
        </div>
      </AudioProvider>
    </BackgroundProvider>
  );
}

export default App;
