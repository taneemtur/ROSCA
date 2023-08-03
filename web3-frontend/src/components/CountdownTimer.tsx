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
    <div className="show-counter">
        <p>{props.days && props.days > 0 &&  + "D"} {props.hours && props.hours + "H" } {props.minutes && props.minutes + "M"} {props.seconds && props.seconds + "S"}</p>
    </div>
  );
};

const CountdownTimer = (props:any) => {
  const [days, hours, minutes, seconds] = useCountdown(props.targetDate);

  if (days + hours + minutes + seconds <= 0) {
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
