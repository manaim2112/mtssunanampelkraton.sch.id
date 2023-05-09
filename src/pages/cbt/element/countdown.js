import { Typography } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import { finishingCBT } from '../../../service/cbt/result';
import { useNavigate } from 'react-router-dom';

function Countdown({time, data, user, list, start}) {
  const [remainingTime, setRemainingTime] = useState(time); // waktu dalam detik
  const [intervalId, setIntervalId] = useState(null);
    const nav = useNavigate();
    const finishing = () => {

        finishingCBT({idlist : list.id, iduser : user.id, answer : JSON.stringify(data)}).then(e => {
            nav("/cbt/finish/"+ start)
        })
    }
  useEffect(() => {
    if (remainingTime <= 0) {
        finishing()
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
