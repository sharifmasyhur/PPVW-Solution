import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setUserId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch CSRF token
      const csrfResponse = await fetch(`${process.env.REACT_APP_API_URL}/csrf-token`, {
        credentials: 'include',
      });
      const { csrfToken } = await csrfResponse.json();
  
      // Send login request
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include CSRF token in the headers
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'An error occurred');
        return;
      }
  
      const data = await response.json();
      alert(data.message);
  
      const { account } = data;
  
      // Save user details in localStorage
      localStorage.setItem('user', JSON.stringify(account));
      navigate('/profile');
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred while trying to log in');
    }
  };
  

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Don't have an account yet?</p>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Login;
