import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { clearErrors, loadUser, updateProfile } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import { MetaData } from "../layout";

export const UpdateProfile = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();
  const avatarDefaul = "/images/avatar-default.png";

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatarDefaul);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { user } = useSelector((state) => state.auth);

  const { isUpdated, error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User updated successfully");
      dispatch(loadUser());
      navigate("/me");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, navigate, alert, user, isUpdated, error]);

  const handleChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (email === "") {
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
    formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };
  return (
    <>
      <MetaData title="Update Profile" />
      <div className="container-container-fluid">
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form
              className="shadow-lg"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <h1 className="mt-2 mb-5">Update Profile</h1>

              <div className="form-group">
                <label for="email_field">Name</label>
                <input
                  type="name"
                  id="name_field"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label for="avatar_upload">Avatar</label>
                <div className="d-flex align-items-center">
                  <div>
                    <figure className="avatar mr-3 item-rtl">
                      <img
                        src={avatarPreview}
                        className="rounded-circle"
                        alt="Avatar Preview"
                      />
                    </figure>
                  </div>
                  <div className="custom-file">
                    <input
                      type="file"
                      name="avatar"
                      className="custom-file-input"
                      id="customFile"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    <label className="custom-file-label" for="customFile">
                      Choose Avatar
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn update-btn btn-block mt-4 mb-3"
                disabled={loading ? true : false}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
