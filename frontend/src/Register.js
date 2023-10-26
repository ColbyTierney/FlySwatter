import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import validate from './RegisterValidation';

function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const checkDatabase = async (username, email) => {
    // You'll need to implement the database check logic here.
    // For example, you can make an API request to your server to check if the username or email already exists in the database.
    const url = 'http://localhost:8081/check-database';
    const data = { username, email };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate({ name, username, email, password });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage('Please check your information.');
    } else {
      try {
        const isExisting = await checkDatabase(username, email);

        if (isExisting) {
          setMessage('Username or Email already in use. Please choose a different one.');
        } else {
          const url = 'http://localhost:8081/register';
          const data = { name, username, email, password };
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            setMessage('Registration successful');
            navigate('/');
          } else {
            setMessage('An error occurred during registration.');
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        setMessage('An error occurred during registration.');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Full Name"
          />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div className="form-input">
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className="form-input">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className="form-input">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className="button-container">
          <button type="submit" className="submit-button">
            Register
          </button>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p>Already Registered? Login here</p>
          </Link>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
