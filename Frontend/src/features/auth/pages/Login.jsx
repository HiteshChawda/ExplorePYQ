import React, { useState } from "react";
import "../auth.form.css";
import { Link } from "react-router";
import { login } from "../services/auth.api";
import { useNavigate } from "react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const response = await login(formData);

      alert(response.message);

      // Redirect after successful login
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <main>
      <div className="form-container">
        <h2 style={{textAlign: "center"}}>Explore PYQ</h2>
        <h1>Login</h1>

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
              placeholder="Enter Email"
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
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register here
            </Link>
          </p>

          <button type="submit" className="button">
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;