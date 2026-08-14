import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import { register as registerUser } from "../services/auth.api";
import { useNavigate } from "react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password =
        "Min 8 characters, 1 uppercase, 1 lowercase, 1 number & 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log(response);
      alert("Registration Successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Registration Failed!");
    }
  };

  return (
    <main>
      <div className="form-container">
        <h2 style={{ textAlign: "center" }}>Explore PYQ</h2>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="username">UserName</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter Username"
            />
            {errors.username && (
              <small className="error-text">{errors.username}</small>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="fullName">FullName</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Enter FullName"
            />
            {errors.fullName && (
              <small className="error-text">{errors.fullName}</small>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
            />
            {errors.email && (
              <small className="error-text">{errors.email}</small>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter Password"
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Y" : "N"}
              </button>
            </div>
            {errors.password && (
              <small className="error-text">{errors.password}</small>
            )}
          </div>

          <p style={{ textAlign: "center" }}>
            Already have an account?
            <Link to="/Login" style={{ textDecoration: "none" }}>
              {" "}
              Login here
            </Link>
          </p>

          <button type="submit" className="button">
            Register
          </button>
        </form>
      </div>
    </main>
  );
};

export default Register;