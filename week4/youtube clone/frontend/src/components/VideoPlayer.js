// src/components/VideoPlayer.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import './VideoPlayer.css';

import { parseISO, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

const VideoPlayer = ({ theme }) => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [inWatchLater, setInWatchLater] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/videos/${id}/`);
        const data = response.data;
        setVideo(data);
        setIsLiked(data.is_liked || false);
        setLikeCount(data.like_count || 0);
      } catch (err) {
        console.error(err);
        setError('Video not found.');
      } finally {
        setLoading(false);
      }
    };


    const fetchComments = async () => {
      try {
        const response = await axios.get(`/videos/${id}/comments/`);
        setComments(response.data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    };

    const fetchWatchLaterStatus = async () => {
      try {
        const response = await axios.get('/watch-later/');
        const videos = Array.isArray(response.data) ? response.data : response.data.videos || [];
        const isIn = videos.some(v => v.id === parseInt(id));
        setInWatchLater(isIn);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideo();
    fetchWatchLaterStatus();
    fetchComments();

  }, [id]);

  const toggleLike = async () => {
    try {
      const response = await axios.post(`/videos/${id}/like-toggle/`);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.like_count);
    } catch (err) {
      console.error('Failed to toggle Like:', err);
    }
  };

  const toggleWatchLater = async () => {
    try {
      const response = await axios.post('/watch-later/toggle/', { video_id: id });
      setInWatchLater(response.data.in_watch_later);
    } catch (err) {
      console.error('Failed to toggle Watch Later:', err);
    }
  };

  const handleShare = async () => {
    const videoUrl = `${window.location.origin}/videos/${id}`;
    try {
      await navigator.clipboard.writeText(videoUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link.');
    }
  };


  const getTimeAgo = (isoDate) => {
    if (!isoDate) return 'N/A';

    const date = parseISO(isoDate);
    const now = new Date();

    const minutes = differenceInMinutes(now, date);

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = differenceInHours(now, date);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = differenceInDays(now, date);
    if (days < 7) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    const weeks = differenceInWeeks(now, date);
    if (weeks < 4) {
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }

    const months = differenceInMonths(now, date);
    if (months < 12) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }

    const years = differenceInYears(now, date);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  };


  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/videos/${id}/comments/`, {
        text: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      });
      console.log('New comment:', response.data);

      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };


  if (error) return <p className="text-danger">{error}</p>;
  if (loading || !video) return <p>Loading...</p>;

  return (
    <div className={`video-player-page ${theme}`}>
      <div className="video-container">
        {video.video_file && (
          <video src={video.video_file} controls width="100%" />
        )}
      </div>

      {/* Title & Actions */}
      <div className={`video-info-top ${theme}`}>
        <h1 className="video-title">{video.title}</h1>
        <div className="video-actions">
          <span className="action-item" onClick={toggleLike}>
            {/* {isLiked ? 'Unlike' : 'Like'}{' '} */}
            Likes
            <i
              className="fas fa-heart"
              style={{ color: isLiked ? 'red' : 'inherit' }}
            ></i>{' '}
            {likeCount}
          </span>
          <span className="action-item" onClick={toggleWatchLater}>
            {inWatchLater ? 'Remove Watch Later' : 'Add Watch Later'}{' '}
            <i className="fas fa-clock me-1"></i>
          </span>
          <span className="action-item" onClick={handleShare}>
            Share <i className="fas fa-share-alt me-1"></i>
          </span>
        </div>
      </div>

      {/* Meta & Description */}
      <div className={`video-info-meta ${theme}`}>
        <p className="video-time">
          Uploaded {video.uploaded_at ? getTimeAgo(video.uploaded_at) : 'N/A'}
        </p>
        <p className="video-description">{video.description}</p>
      </div>

      {/* Comments section can come next! */}
      <div className={`comments-section ${theme}`}>
        <h4>Comments</h4>
        <form onSubmit={handleAddComment} className="mb-3">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button type="submit" className="btn btn-secondary mt-2">Post</button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>{comment.username}</strong> · {getTimeAgo(comment.created_at)}
                <p>{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default VideoPlayer;
