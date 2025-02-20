import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = (name, value) => {
    switch (name) {
      case 'username':
        return value.length < 3 ? 'Username must be at least 3 characters' : '';
        
      case 'email':
        return !value.includes('@') ? 'Please enter a valid email' : '';
        
      case 'password':
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
        
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Remove extra spaces
    const cleanValue = value.trim();
    
    setFormData({
      ...formData,
      [name]: cleanValue
    });

    // Simple validation
    const error = validateInput(name, cleanValue);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    // Check if all fields are filled
    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate all fields
    const usernameError = validateInput('username', username);
    const emailError = validateInput('email', email);
    const passwordError = validateInput('password', password);

    if (usernameError || emailError || passwordError) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful");
        navigate("/");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
};

export default Register;