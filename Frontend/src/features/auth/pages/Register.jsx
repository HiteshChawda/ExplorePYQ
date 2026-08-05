import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import { register as registerUser } from "../services/auth.api";
import { useNavigate } from "react-router";


const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);
      console.log(response);
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration Failed!");
    }
  };
  return (
    <main>
      <div className="form-container">
        <h2 style={{textAlign: "center"}}>Explore PYQ</h2>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">UserName</label>
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
            <label htmlFor="email">FullName</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Enter FullName"
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
              placeholder="Enter your email"
            />
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
