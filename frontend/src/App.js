import React from "react";
import { Header } from "./components/layout/Header";
import "./App.css";
import { Footer } from "./components/layout/Footer";
import { Home } from "./components/Home";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />
      <div className="container container-fluid">
        <Routes>
          <Route path="/" element={<Home />} exact />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
