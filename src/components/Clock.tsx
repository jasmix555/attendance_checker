// Import necessary modules
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja"; // Import the Japanese locale for dayjs

// Component to display and continuously update the current time
const Clock = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    // Set the locale to Japanese
    dayjs.locale("ja");

    const intervalId = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000); // Update every second

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h2>{currentTime.format("YYYY年MM月DD日(dd)")}</h2>
      <p>{currentTime.format("HH:mm:ss")}</p>
    </div>
  );
};

export default Clock;
