// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css'

const Sidebar = ({ theme }) => {
  
  return (
    <div className={`sidebar ${theme === 'dark' ? 'dark' : 'light'}`} >
      <h5 className="mb-4">Menu</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className={`nav-link ${theme === 'dark' ? 'text-light' : 'text-dark'}`} to="/">
            <i className="fas fa-home me-2"></i> Home
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link ${theme === 'dark' ? 'text-light' : 'text-dark'}`} to="/upload">
            <i className="fas fa-upload me-2"></i> Upload
          </Link>
        </li>        
        <li className="nav-item mb-2">
          <Link className={`nav-link ${theme === 'dark' ? 'text-light' : 'text-dark'}`} to="/dashboard">
            <i className="fas fa-tachometer-alt me-2"></i> Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link ${theme === 'dark' ? 'text-light' : 'text-dark'}`} to="/watch-later">
            <i className="fas fa-clock me-2"></i> Watch Later
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
