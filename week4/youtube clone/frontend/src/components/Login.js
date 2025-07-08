import React, { useState } from 'react';
import axios from '../axiosConfig'; // your pre-configured Axios instance
import { Link, useNavigate } from 'react-router-dom';

import FormContainer from '../components/FormContainer';

const Login = ({theme}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Adjust endpoint to match your Django backend
      const response = await axios.post('/login/', {
        username: username,
        password: password,
      });

      // Save tokens in localStorage
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', response.data.username);

      setError('');
      console.log('Login successful!');

      navigate('/dashboard'); // or '/'

    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <FormContainer theme={theme}>
      <h2 className="mb-4 text-center">Login</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username or Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        <p className="mt-3">
          Haven't signed up yet?{' '}
          <Link to="/register">Register here</Link>
        </p>

      </form>
    </FormContainer>
  );
};

export default Login;
