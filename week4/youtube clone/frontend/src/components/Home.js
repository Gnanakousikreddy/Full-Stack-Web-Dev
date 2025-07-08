import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig'; // use your pre-configured Axios instance if you have one
import VideoCard from './VideoCard';


import { useContext } from 'react';
import SearchContext from '../context/SearchContext';

const Home = ({theme}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('/videos/'); // your backend endpoint
        setVideos(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);


  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Latest Videos</h2>

      {loading && <p>Loading videos...</p>}
      {error && <p className="text-danger">{error}</p>}

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

export default Home;
