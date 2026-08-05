import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">Explore PYQ</h2>

        <p className="footer-description">
          Your trusted platform for Notes, PDFs and Previous Year Question
          Papers. Learn smarter and achieve your academic goals.
        </p>

        <div className="footer-links">
          <Link to="/home">Home</Link>

          <Link to="/pyqs">PYQs</Link>

          <Link to="/post">Post</Link>

        </div>

        <hr />

        <p className="copyright">© 2026 Explore PYQ by HC Creates</p>
      </div>
    </footer>
  );
};

export default Footer;
