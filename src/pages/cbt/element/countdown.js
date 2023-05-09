import { Typography } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';

function Countdown({time}) {
  const [remainingTime, setRemainingTime] = useState(time); // waktu dalam detik
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      return;
    }

    const id = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    setIntervalId(id);
    return () => clearInterval(id);
  }, [remainingTime]);

  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return (
    <div>
      <Typography color="red" variant="h3">{hours < 10 ? "0" : ""}{hours}:{minutes < 10 ? '0' : ''}{minutes}:{seconds < 10 ? '0' : ''}{seconds}</Typography>
    </div>
  );
}

export default Countdown;
