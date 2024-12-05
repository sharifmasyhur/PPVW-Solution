import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User berhasil didaftarkan:', data);
        alert('Registrasi berhasil! Silakan login.');
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Terjadi kesalahan saat registrasi');
      }
    } catch (error) {
      console.error('Error saat registrasi:', error);
      setError('Tidak dapat terhubung ke server. Coba lagi nanti.');
    }
  };

  return (
    <div className="signup-container">
      <button className="back-button" onClick={() => navigate('/')}>
        Kembali
      </button>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Nama:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;