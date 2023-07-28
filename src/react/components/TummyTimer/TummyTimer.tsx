import { useEffect, useRef, useState } from "react";
import useTimer, { TimerResult } from "src/react/hooks/TummyTimer/useTimer";
import type * as Tone from "tone";

const NUM_TIMERS = 5;
const SECONDS_PER_TIMER = 120;
const COLORS = ["#e85e48", "orange", "yellow", "#23c823", "#2c86d4"];

const TummyTimer = () => {
  const [activeTimer, setActiveTimer] = useState(0);
  const synthRef = useRef<Tone.Synth | null>(null);

  const timers: TimerResult[] = [];
  for (let i = 0; i < NUM_TIMERS; i++) {
    timers.push(
      useTimer(
        SECONDS_PER_TIMER,
        () => {
          console.log(`Timer #${i + 1} is done!`);
          if (i < NUM_TIMERS) {
            setActiveTimer((t) => t + 1);
          } else {
            console.log("All timers are done!");
          }
        },
        synthRef
      )
    );
  }

  useEffect(() => {
    const timerInfo = timers[activeTimer];
    if (!timerInfo) {
      return () => {};
    }
    const [_, start, stop] = timerInfo;

    if (activeTimer > 0) {
      start();
    }

    return () => {
      stop();
    };
  }, [activeTimer]);

  const timerInfo = timers[activeTimer];
  const [_, start, stop] = timerInfo || [null, () => {}, () => {}];

  return (
    <div className="timer-container">
      <div className="timer-timers">
        {timers.map((t, idx) => (
          <div
            className="timer-timer"
            key={idx}
            style={{
              backgroundColor: COLORS[idx % COLORS.length],
              opacity: activeTimer === idx ? 1 : 0.5,
            }}
            onClick={() => setActiveTimer(idx)}
          >
            {t[0]}
          </div>
        ))}
      </div>

      <div className="timer-controls">
        <button
          onClick={() => {
            start();
          }}
        >
          Start
        </button>
        <button onClick={() => stop()}>Stop!</button>
      </div>
    </div>
  );
};

export default TummyTimer;
