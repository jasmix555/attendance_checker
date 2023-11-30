import { useState } from "react";
import dayjs from "dayjs";
import { useEffect } from "react";

const AttendanceChecker = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [startWork, setStartWork] = useState<dayjs.Dayjs | null>(null);
  const [startBreak, setStartBreak] = useState<dayjs.Dayjs | null>(null);
  const [endBreak, setEndBreak] = useState<dayjs.Dayjs | null>(null);
  const [endWork, setEndWork] = useState<dayjs.Dayjs | null>(null);
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    dayjs.locale("ja");
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleStartWork = () => {
    setStartWork(dayjs());
  };

  const handleStartBreak = () => {
    setStartBreak(dayjs());
    setIsOnBreak(true);
  };

  const handleEndBreak = () => {
    setEndBreak(dayjs());
    setIsOnBreak(false);
  };

  const handleEndWork = () => {
    setEndWork(dayjs());
  };

  const calculateWorkHours = () => {
    if (startWork && endWork) {
      const workHours = endWork.diff(startWork, "hour", true);
      if (startBreak && endBreak) {
        const breakHours = endBreak.diff(startBreak, "hour", true);
        return workHours - breakHours;
      }
      return workHours;
    }
    return 0;
  };

  return (
    <div>
      <h2>{currentTime.format("YYYY年MM月DD日(dd)")}</h2>
      <p>{currentTime.format("HH:mm:ss")}</p>
      <button disabled={startWork !== null} onClick={handleStartWork}>
        出勤
      </button>
      <button
        disabled={startWork === null || endWork !== null}
        onClick={isOnBreak ? handleEndBreak : handleStartBreak}
      >
        {isOnBreak ? "休憩終了" : "休憩開始"}
      </button>
      <button
        disabled={startWork === null || endWork !== null || isOnBreak}
        onClick={handleEndWork}
      >
        退勤
      </button>
      <p>Worked Hours: {calculateWorkHours()}</p>
    </div>
  );
};

export default AttendanceChecker;
