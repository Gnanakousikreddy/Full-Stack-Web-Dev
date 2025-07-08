// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, theme, toggleTheme }) => {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container-fluid" style={{ paddingTop: '56px' }}>
        <div className="row">
          <div className="col-md-2 p-0">
            <Sidebar theme={theme} />
          </div>
          <div className={`col-md-10 p-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
