import "./App.css";
import store from "./store/configureStore";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";
import { Home } from "./components/Home";
import { ProductDetails } from "./components/product";
import { Login } from "./components/user/Login";
import { Register } from "./components/user/Register";
import { loadUser } from "./actions/userAction";
import { Profile } from "./components/user/Profile";
import { ProtectedRoute } from "./route/ProtectedRoute";
import { UpdateProfile } from "./components/user/UpdateProfile";

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <>
      <Header />
      <div className="container container-fluid">
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route exact path="/" element={<ProtectedRoute />}>
            <Route path="/me" element={<Profile />} />
            <Route path="/me/update" element={<UpdateProfile />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
