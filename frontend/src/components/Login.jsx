import React from 'react';
import styles from './Login.module.css';

const Login = () => {
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
            placeholder="LabAdmin@nltc.ac.in"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            placeholder="Enter your password"
          />
          <a href="/forgot-password" className={styles.forgotPassword}>Forgot ?</a>
        </div>

        <button className={styles.loginButton}>Login now</button>
        <p className={styles.signUpText}>
          Don't Have An Account? <a href="/signup" className={styles.signUpLink}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;