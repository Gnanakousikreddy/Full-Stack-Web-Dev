import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Start the timer
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-sm text-black-200 ml-4">
      <FontAwesomeIcon icon={faClock} className="mr-1" />
      Time Spent: {seconds} sec
    </div>
  );
};

export default Timer;
