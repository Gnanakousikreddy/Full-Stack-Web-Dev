// src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SearchContext  from '../context/SearchContext';
import './Navbar.css'; // Make sure you import the custom CSS!

const Navbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access');
  const username = localStorage.getItem('username') || 'User';

  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    console.log('Search submitted:', inputValue);
  };

  return (
    <nav className={`navbar-container ${theme}`}>
      {/* Left: Logo */}
      <div className="navbar-left">
        <Link className="navbar-logo" to="/">
          <i className="fab fa-youtube text-danger"></i>
          <span>YTClone</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="navbar-center">
        <form
          className={`navbar-search-form ${theme === 'dark' ? 'dark' : 'light'}`}
          onSubmit={handleSearch}
        >
          <input
            className="navbar-search-input"
            type="search"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="navbar-search-btn"
            type="submit"
            title="Search"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {/* Right: Theme toggle + Auth */}
      <div className="navbar-right">
        <button
          className="theme-toggle-btn btn btn-outline-secondary rounded-circle ms-2"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>

        {isAuthenticated ? (
          <>
            <span className="navbar-username">{username}</span>
            <button className="btn btn-outline-secondary ms-2" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline-light ms-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-light ms-2">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
