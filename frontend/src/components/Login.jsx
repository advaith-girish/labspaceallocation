import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // Use module CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/email/${email}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert("Invalid credentials");
        return;
      }

      const user = await response.json();
      console.log("User Data:", user);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on user role
      if (user.role === "STUDENT") {
        navigate("/profile");
      } else if (user.role === "LAB_ADMIN" || user.role === "ADMIN") {
        navigate("/");
      } else {
        alert("Unknown role");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login to your account</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="/forgot-password" className={styles.forgotPassword}>Forgot?</a>
        </div>

        <button className={styles.loginButton} onClick={handleLogin}>Login now</button>
        
        {/* <p className={styles.signUpText}>
          Don't Have An Account? <a href="/signup" className={styles.signUpLink}>Sign Up</a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
