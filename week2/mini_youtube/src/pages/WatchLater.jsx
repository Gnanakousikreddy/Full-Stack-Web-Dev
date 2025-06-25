import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';

const WatchLater = () => {
  const [videos, setVideos] = useState([]);

  // Load videos from sessionStorage
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('watchLater')) || [];
    setVideos(saved);
  }, []);

  const handleRemove = (id) => {
    const updated = videos.filter((video) => video.id !== id);
    setVideos(updated);
    sessionStorage.setItem('watchLater', JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Watch Later</h1>
      {videos.length === 0 ? (
        <p className="text-gray-600">No videos added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchLater;
