import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Validation from './LoginValidation';
import { useUser } from './UserContext';

function Login() {
  const { setUsername } = useUser('');
  const [username, setUsernameLocally] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsernameLocally(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = Validation(username, password);

    if (validationErrors.username) {
      setEmailError(validationErrors.username);
    } else {
      setEmailError('');
    }

    if (validationErrors.password) {
      setPasswordError(validationErrors.password);
    } else {
      setPasswordError('');
    }

    if (validationErrors.username || validationErrors.password) {
      setMessage('Please fix the following errors:');
      return;
    }

    try {
      const url = 'http://localhost:8081/login';
      const data = { username, password };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setUsername(username);
        setMessage('Login successful');
        navigate('/Dashboard');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred during login.');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
          />
          {emailError && <p className="error-message">{emailError}</p>}
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
          {passwordError && <p className="error-message">{passwordError}</p>}
        </div>
        <div className="button-container">
          <button type="submit" className="submit-button">
            Login
          </button>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <p>Don't have an account? Register here</p>
          </Link>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
