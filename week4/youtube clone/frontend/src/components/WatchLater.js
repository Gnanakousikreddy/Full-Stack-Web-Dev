// src/pages/WatchLater.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import VideoCard from '../components/VideoCard';

import { useContext } from 'react';
import SearchContext from '../context/SearchContext';

const WatchLater = ({ theme }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('access');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        const response = await axios.get('/watch-later/');
        const fetchedVideos = Array.isArray(response.data) ? response.data : response.data.videos || [];
        setVideos(fetchedVideos);
      } catch (err) {
        console.error(err);
        setError('Failed to load Watch Later list.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, []);


  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleWatchLater = (videoId, inWatchLater) => {
    // Remove from list immediately if removed
    if (!inWatchLater) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Watch Later</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {videos.length === 0 && !loading && (
        <p>You have no videos saved for Watch Later.</p>
      )}

      <div className="row">
        {filteredVideos.map((video) => (
          <div key={video.id} className="col-md-4 mb-4">
            <VideoCard video={video} theme={theme} onToggleWatchLater={handleToggleWatchLater} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchLater;
