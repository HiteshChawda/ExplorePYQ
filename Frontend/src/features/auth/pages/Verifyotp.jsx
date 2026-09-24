import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { verifyOtp, resendOtp } from "../services/auth.api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    try {
      const response = await verifyOtp({ email, otp });
      alert(response.message);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    setResending(true);
    setMessage("");
    setError("");
    try {
      const response = await resendOtp({ email });
      setMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h2 style={{ textAlign: "center" }}>Explore PYQ</h2>
        <h1>Verify Your Email</h1>

        <p style={{ textAlign: "center", marginBottom: "10px" }}>
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            {error && <small className="error-text">{error}</small>}
            {message && (
              <small style={{ color: "#4ade80", display: "block", marginTop: "4px" }}>
                {message}
              </small>
            )}
          </div>

          <p style={{ textAlign: "center" }}>
            Didn't get the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={{
                background: "none",
                border: "none",
                color: "#38bdf8",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>

          <button type="submit" className="button">
            Verify
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default VerifyOtp;