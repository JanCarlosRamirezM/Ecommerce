import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Header, Footer } from "./components/layout";
import { Home } from "./components/Home";
import { ProductDetails } from "./components/product";

const App = () => {
  return (
    <>
      <Header />
      <div className="container container-fluid">
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
