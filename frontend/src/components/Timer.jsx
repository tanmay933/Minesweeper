import React, { useEffect, useRef, useState } from "react";

export default function Timer({ running, resetKey, onTime }) {
  const elapsedRef = useRef(0);
  const intervalRef = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    elapsedRef.current = 0;
    setDisplay(0);
    if (typeof onTime === "function") {
      onTime(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (running) {
      intervalRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setDisplay(elapsedRef.current);
        if (typeof onTime === "function") {
          onTime(elapsedRef.current);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, onTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return <div className="timer">Time: {display}s</div>;
}
