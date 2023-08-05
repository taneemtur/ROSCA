import React from 'react';
import { useCountdown } from '../contexts/Countdown';

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      0s
    </div>
  );
};

const ShowCounter = (props:any) => {
  return (
    <div className="show-counter flex">
        <p className='pr-1'>{props.days&&props.days}D</p>
        <p className='pr-1'>{props.hours&&props.hours}H</p>
        <p className='pr-1'>{props.minutes&&props.minutes}M</p>
        <p className='pr-1'>{props.seconds&&props.seconds}S</p>
    </div>
  );
};

const CountdownTimer = (props:any) => {
  const [days, hours, minutes, seconds] = useCountdown(props.targetDate);

  if (days + hours + minutes + seconds <= 0) {
    props.setExpired(true)
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
