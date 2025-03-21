import React, { useState } from "react";
import styles from "./styles/AddLabAdmin.module.css";

const AddLabAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "LAB_ADMIN" 
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
        "Accept": "application/json" 
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "LAB_ADMIN"
          })
      });

      if (!response.ok) {
        throw new Error("Failed to register Lab Admin");
      }

      setMessage("Lab Admin registered successfully!");
      setFormData({ name: "", email: "", password: "", role: "LAB_ADMIN" });
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error: Unable to register Lab Admin.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Lab Admin</h2>
      {message && <p className={styles.message}>{message}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit" className={styles.submitButton}>Register Admin</button>
      </form>
    </div>
  );
};

export default AddLabAdmin;
