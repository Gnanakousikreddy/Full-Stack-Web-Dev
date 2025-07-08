// src/components/VideoCard.js
import React, { useState, useEffect } from 'react';
import './VideoCard.css';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';

const VideoCard = ({ video, theme, onToggleWatchLater }) => {
  const [inWatchLater, setInWatchLater] = useState(false);
  const [isLiked, setIsLiked] = useState(video.is_liked || false);
  const [likeCount, setLikeCount] = useState(video.like_count || 0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/watch-later/');
        const videos = Array.isArray(response.data) ? response.data : response.data.videos || [];
        const isIn = videos.some(v => v.id === video.id);
        setInWatchLater(isIn);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, [video.id]);

  const toggleWatchLater = async () => {
    try {
      const response = await axios.post('/watch-later/toggle/', { video_id: video.id });
      setInWatchLater(response.data.in_watch_later);

      if (onToggleWatchLater) {
        onToggleWatchLater(video.id, response.data.in_watch_later);
      }
    } catch (err) {
      console.error('Failed to toggle Watch Later:', err);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await axios.post(`/videos/${video.id}/like-toggle/`);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.like_count);
    } catch (err) {
      console.error('Failed to toggle Like:', err);
    }
  };

  
  const handleShare = async () => {
    const videoUrl = `${window.location.origin}/videos/${video.id}`;
    try {
      await navigator.clipboard.writeText(videoUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link.');
    }
  };


  return (
    <div className={`video-card ${theme}`}>
      <Link to={`/videos/${video.id}`}>
        <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
      </Link>
      <div className="video-info">
        <h5 className="video-title">{video.title}</h5>
        <div className="video-actions">
          <span className="action-item" onClick={toggleLike}>
            {/* {isLiked ? 'Unlike' : 'Like'}{' '} */}
            <i className="fas fa-heart" style={{ color: isLiked ? 'red' : 'inherit' }}></i> {likeCount}
          </span>
          <span className="action-item" onClick={toggleWatchLater}>
            {inWatchLater ? 'Remove Watch Later' : 'Add Watch Later'} <i className="fas fa-clock me-1"></i>
          </span>
          <span className="action-item" onClick={handleShare}>
            Share <i className="fas fa-share me-1"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
