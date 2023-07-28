import {
  useState,
  FunctionComponentElement,
  useEffect,
  useRef,
  MutableRefObject,
} from "react";
import * as Tone from "tone";

export type StartTimerFunc = (seconds?: number) => void;
export type StopTimerFunc = () => number;
export type TimerComponent = FunctionComponentElement<{}>;
export type TimerResult = [TimerComponent, StartTimerFunc, StopTimerFunc];

const Timer = ({ timeRemaining: time }: { timeRemaining: number }) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return (
    <div className="timer-time">{`${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</div>
  );
};

export default function useTimer(
  seconds: number,
  done: () => void,
  synthRef: MutableRefObject<Tone.Synth | null>
): [TimerComponent, StartTimerFunc, StopTimerFunc] {
  // time in milliseconds.
  const [time, setTime] = useState(seconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const startTimer = (seconds?: number) => {
    if (seconds) {
      setTime(seconds * 1000);
    }
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    return time;
  };

  useEffect(() => {
    if (time === 0) {
      done();
    } else if (time < 0) {
      console.error("Error: time remaining should never be less than 0", time);
    }
  }, [time]);

  useEffect(() => {
    if (isRunning && time > 0) {
      const startTime = Date.now();
      const updateTimer = () => {
        const elapsedTime = Date.now() - startTime;
        setTime((prevTime) => {
          const newTime = prevTime - elapsedTime;
          if (Math.floor(newTime / 1000) !== Math.floor(prevTime / 1000)) {
            console.log(newTime);
            if (newTime < 4000 && newTime > 1000) {
              if (!synthRef.current) {
                synthRef.current = new Tone.Synth().toDestination();
              }
              synthRef.current.triggerAttackRelease("C4", "8n");
            } else if (newTime <= 1000 && newTime > 0) {
              if (!synthRef.current) {
                synthRef.current = new Synth().toDestination();
              }
              synthRef.current.triggerAttackRelease("C5", "8n");
            }
          }
          return Math.max(0, newTime);
        });
        if (time > 0) {
          animationFrameRef.current = requestAnimationFrame(updateTimer);
        }
      };
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, time]);

  return [<Timer timeRemaining={time} />, startTimer, stopTimer];
}
