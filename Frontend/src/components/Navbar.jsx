import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { logout } from "../features/auth/services/auth.api";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Logout Failed");
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/home">Explore PYQ</Link>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        &#8942;
      </button>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/home" onClick={closeMenu}>Home</Link>
        </li>

        <li>
          <Link to="/pyqs" onClick={closeMenu}>PYQs</Link>
        </li>

        <li>
          <Link to="/post" onClick={closeMenu}>Post</Link>
        </li>

        <li>
          <button
            className="logout-btn"
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;