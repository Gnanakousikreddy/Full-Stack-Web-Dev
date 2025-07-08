// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SearchContext from './context/SearchContext';

import Layout from './components/Layout';
import Home from './components/Home';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import WatchLater from './components/WatchLater';
import Login from './components/Login';
import Register from './components/Register';
import VideoPlayer from './components/VideoPlayer'; // If you have a single video page

const App = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark';
  }, [theme]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <Router>
        <Layout theme={theme} toggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<Home theme = {theme}/>} />
            <Route path="/upload" element={<Upload theme = {theme}/>} />
            <Route path="/dashboard" element={<Dashboard theme={theme}/>} />
            <Route path="/watch-later" element={<WatchLater theme={theme}/>} />
            <Route path="/login" element={<Login theme={theme}/>} />
            <Route path="/register" element={<Register theme={theme}/>} />
            <Route path="/videos/:id" element={<VideoPlayer theme = {theme}/>} />
            {/* Add other routes as needed */}
          </Routes>
        </Layout>
      </Router>
    </SearchContext.Provider>
  );
};

export default App;
