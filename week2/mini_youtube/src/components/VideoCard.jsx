import React, { useEffect, useState } from 'react';

import {
  faThumbsUp as solidThumbsUp,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const VideoCard = ({ video, onRemove }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(() => Math.floor(Math.random()*51)+ 50);
  const [watchLater, setWatchLater] = useState(false);

  // Load saved state from sessionStorage
  useEffect(() => {
    const likedList = JSON.parse(sessionStorage.getItem('likedVideos')) || [];
    const watchLaterList = JSON.parse(sessionStorage.getItem('watchLater')) || [];
    const likesMap = JSON.parse(sessionStorage.getItem('likesMap')) || {};

    if (likedList.includes(video.id)) setLiked(true);
    if (watchLaterList.some((v) => v.id === video.id)) setWatchLater(true);
    if (likesMap[video.id] !== undefined) setLikesCount(likesMap[video.id]);
  }, [video.id]);

  // Toggle like state and store in sessionStorage
  const handleLike = () => {
    const likedList = JSON.parse(sessionStorage.getItem('likedVideos')) || [];
    let updatedLiked;
    let likesMap = JSON.parse(sessionStorage.getItem('likesMap')) || {};
    let count = likesCount;

    if (liked) {
      updatedLiked = likedList.filter((id) => id !== video.id);
      count = Math.max(0, count - 1);
    } else {
      updatedLiked = [...likedList, video.id];
      count = count + 1;
    }

    likesMap[video.id] = count;
    sessionStorage.setItem('likedVideos', JSON.stringify(updatedLiked));
    sessionStorage.setItem('likesMap', JSON.stringify(likesMap));
    setLiked(!liked);
    setLikesCount(count);
  };

  // Toggle Watch Later and store in sessionStorage
    const handleWatchLater = () => {
    let stored = JSON.parse(sessionStorage.getItem('watchLater')) || [];
    const exists = stored.some((v) => v.id === video.id);

    let updated;
    if (exists) {
        updated = stored.filter((v) => v.id !== video.id);
        setWatchLater(false);
    } else {
        updated = [...stored, video];
        setWatchLater(true);
    }
    sessionStorage.setItem('watchLater', JSON.stringify(updated));
    setTimeout(() => {
        window.dispatchEvent(new Event('watchlater-updated'));
    }, 0);
    };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt="thumbnail"
        className="w-full h-56 object-cover rounded-t-xl rounded-b-none" 
        style={{ borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}
      />

      {/* Info */}
      <div
        className={`px-4 py-2 space-y-1 rounded-b-xl ${
          // Match background with card
          'bg-white dark:bg-gray-800'
        }`}
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <h2 className="font-bold text-lg text-gray-900 dark:text-white leading-snug line-clamp-2">
          {video.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {video.channel}
        </p>

        {/* Views + Time + Buttons Row */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>
            {video.views} Views • {video.time}
          </span>
          <div className="flex items-center gap-3">
            {/* Like Button with count */}
            <button
              onClick={handleLike}
              title={liked ? 'Unlike' : 'Like'}
              className="flex items-center gap-1 text-xl transition hover:scale-110"
            >
              <span className={`text-sm font-semibold ${liked ? 'text-blue-500' : 'text-gray-400'}`}>
                {likesCount}
              </span>
              <FontAwesomeIcon
                icon={liked ? solidThumbsUp : regularThumbsUp}
                className={liked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'}
              />
            </button>

            {/* Watch Later / Remove Button */}
            {onRemove ? (
              <button
                onClick={() => onRemove(video.id)}
                title="Remove from Watch Later"
                className="text-xl transition hover:scale-110"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-red-500 hover:text-red-400"
                />
              </button>
            ) : (
              <button
                onClick={handleWatchLater}
                title={watchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}
                className={`flex items-center gap-1 text-xl transition hover:scale-110 ${
                  watchLater ? 'text-blue-500' : ''
                }`}
              >
                <span className={`text-sm font-semibold ${watchLater ? 'text-blue-500' : 'text-gray-400'}`}>
                  Watch Later
                </span>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={`${
                    watchLater
                      ? 'text-blue-500'
                      : 'text-gray-400 hover:text-blue-400'
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
//
};
//

export default VideoCard;
