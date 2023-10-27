import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { MetaData, Loader } from "../layout";
import { clearErrors, register } from "../../actions/userAction";

export const Register = () => {
  const avatarDefaul = "/images/avatar-default.png";
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatarDefaul);
  const [User, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = User;

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate("/");
    }
  }, [dispatch, alert, isAuthenticated, error, navigate]);

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...User, [e.target.name]: e.target.value });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert.error("Email and password are required");
      return;
    }

    if (name === "") {
      alert.error("Name is required");
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("avatar", avatar);

    dispatch(register(formData));
  };

  return (
    <div>
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <MetaData title="Register" />
            <div className="row wrapper">
              <div className="col-10 col-lg-5">
                <form
                  className="shadow-lg"
                  enctype="multipart/form-data"
                  onSubmit={submitHandler}
                  encType="multipart/form-data"
                >
                  <h1 className="mb-3">Register</h1>

                  <div className="form-group">
                    <label for="email_field">Name</label>
                    <input
                      type="name"
                      id="name_field"
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <label for="email_field">Email</label>
                    <input
                      type="email"
                      id="email_field"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <label for="password_field">Password</label>
                    <input
                      type="password"
                      id="password_field"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <label for="avatar_upload">Avatar</label>
                    <div className="d-flex align-items-center">
                      <div>
                        <figure className="avatar mr-3 item-rtl">
                          <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            className="rounded-circle"
                          />
                        </figure>
                      </div>
                      <div className="custom-file">
                        <input
                          type="file"
                          name="avatar"
                          className="custom-file-input"
                          id="customFile"
                          accept="image/*"
                          onChange={(e) => handleChange(e)}
                        />
                        <label className="custom-file-label" for="customFile">
                          Choose Avatar
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    id="register_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={loading ? true : false}
                  >
                    REGISTER
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};
