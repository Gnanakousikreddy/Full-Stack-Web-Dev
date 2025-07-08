import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';
import VideoCard from './VideoCard';

import { useContext } from 'react';
import SearchContext from '../context/SearchContext';


const Dashboard = ({theme}) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('access');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const response = await axios.get('/videos/user/');
        console.log('User videos:', response.data);
        setVideos(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load your videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Uploaded Videos</h2>

      {loading && <p>Loading your videos...</p>}
      {error && <p className="text-danger">{error}</p>}

      {videos.length === 0 && !loading && (
        <p>You haven’t uploaded any videos yet.</p>
      )}

      <div className="row">
        {filteredVideos.map((video) => (
          <div key={video.id} className="col-md-4 mb-4">
            <VideoCard video = {video} theme = {theme}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
