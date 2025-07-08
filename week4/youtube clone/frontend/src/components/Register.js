import React, { useState } from 'react';
import axios from '../axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

import FormContainer from '../components/FormContainer';

const Register = ({theme}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/register/', {
        username: username,
        email: email,
        password: password1,
      });

      console.log(response.data);
      setSuccess('Registration successful! Redirecting to login...');
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const messages = Object.values(errorData).flat().join(' ');
        setError(messages);
      } else {
        setError('Registration failed. Please try again.');
      }
      setSuccess('');
    }
  };

  return (
    <FormContainer theme={theme}>
      <h2 className="mb-4 text-center">Register</h2>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Username *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password *</label>
          <input
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password *</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>

        <p className="mt-3">
          Already signed up?{' '}
          <Link to="/login">Login here</Link>
        </p>

      </form>
    </FormContainer>
  );
};

export default Register;
