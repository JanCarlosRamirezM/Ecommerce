import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Link, useNavigate } from "react-router-dom";
import { MetaData, Loader } from "../layout";
import { clearErrors, login } from "../../actions/userAction";

export const Login = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, isAuthenticated, error, navigate]);

  const loginHandler = (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert.error("Email and password are required");
      return;
    }

    dispatch(login(email, password));
  };

  return (
    <div>
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <MetaData title="Login" />
            <div className="row wrapper">
              <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={loginHandler}>
                  <h1 className="mb-3">Login</h1>
                  <div className="form-group">
                    <label htmlFor="email_field">Email</label>
                    <input
                      type="email"
                      id="email_field"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password_field">Password</label>
                    <input
                      type="password"
                      id="password_field"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Link to={"/password/forgot"} className="float-right mb-4">
                    Forgot Password?
                  </Link>

                  <button
                    id="login_button"
                    type="submit"
                    className="btn btn-block py-3"
                  >
                    LOGIN
                  </button>

                  <Link to="/register" className="float-right mt-3">
                    New User?
                  </Link>
                </form>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};
