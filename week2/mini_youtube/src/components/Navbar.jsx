import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Timer from './Timer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {
      const saved = JSON.parse(sessionStorage.getItem('watchLater')) || [];
      setWatchLaterCount(saved.length);
    };
    updateCount();

    window.addEventListener('storage', updateCount);

    window.addEventListener('watchlater-updated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('watchlater-updated', updateCount);
    };
  }, [location]);

  return (
    <nav
      className={`w-full flex items-center justify-between flex-wrap px-6 py-3 sticky top-0 z-50 border-b ${
        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-black'
      }`}
    >
      {/* Left: Logo */}
      <Link
        to="/"
        className="shrink-0 flex items-center text-2xl font-extrabold tracking-tight whitespace-nowrap mr-4"
        style={{
          fontFamily: 'Roboto, sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        <FontAwesomeIcon icon={faYoutube} className="text-red-600 text-3xl mr-2" />
        MiniTube
      </Link>

      {/* Center: Search Bar */}
      <div className="flex-1 min-w-0 overflow-hidden flex justify-center px-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`w-full max-w-lg px-4 py-2.5 rounded-full border-2 text-sm shadow-sm focus:outline-none focus:ring-2 transition ${
          darkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 '
            : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500 '
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      </div>

      {/* Right: Controls */}
      <div className="shrink-0 flex items-center space-x-4 min-w-fit ml-4">
        {/* Watch Later */}
        <Link
          to="/watchlater"
          className={`relative px-4 py-2 rounded-full font-medium text-sm transition flex items-center ${
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-pink-400'
              : 'bg-gray-100 hover:bg-gray-200 text-red-600'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Watch Later
          {watchLaterCount > 0 && (
            <span className="absolute -top-1 -right-2 text-xs px-2 py-0.5 rounded-full bg-red-500 text-white border-2 border-white">
              {watchLaterCount}
            </span>
          )}
        </Link>

        {/* Timer with icon */}
        <div className={`text-sm font-semibold flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-black'}`}>
          <Timer />
        </div>

        {/* Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition border flex items-center gap-2 ${
            darkMode
              ? 'bg-gray-800 text-pink-300 border-pink-500 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;