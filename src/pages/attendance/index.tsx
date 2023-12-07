import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useEffect } from "react";
import style from "@/styles/attendance.module.scss";
import {
  FaRightToBracket,
  FaRightFromBracket,
  FaCircleStop,
  FaCirclePlay,
  FaRegClock,
  FaUmbrellaBeach,
  FaCalendarDays,
} from "react-icons/fa6";
import Layout from "@/components/Layout";
import Username from "@/components/Username";
import Signout from "@/components/Signout";

const holidayBtn = [
  {
    icon: <FaUmbrellaBeach />,
    text: "休日申請",
    class: style.holiday,
    description: "有給休暇・特別休暇",
    description2: "体調不良・その他",
  },
  {
    icon: <FaCalendarDays />,
    text: "勤怠変更申請",
    class: style.holiday,
    description: "勤怠時間変更・その他",
  },
];

const AttendanceChecker = () => {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs | null>(null);
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
      const workHours = endWork.diff(startWork, "hour");
      const workMinutes = endWork.diff(startWork, "minute") % 60;
      const workSeconds = endWork.diff(startWork, "second") % 60;

      const formattedWorkHours = String(workHours).padStart(2, "0");
      const formattedWorkMinutes = String(workMinutes).padStart(2, "0");
      const formattedWorkSeconds = String(workSeconds).padStart(2, "0");

      return `${formattedWorkHours}:${formattedWorkMinutes}:${formattedWorkSeconds}`;
    }
    return "00:00:00";
  };

  const getAttendanceState = () => {
    if (startWork && !endWork) {
      if (isOnBreak) {
        return { icon: <FaCircleStop />, text: "休憩中", class: style.break };
      } else {
        return { icon: <FaRegClock />, text: "出勤中", class: style.start };
      }
    } else if (endWork) {
      return {
        icon: <FaRightFromBracket />,
        text: "退勤済み",
        class: style.end,
      };
    }
    return { icon: <FaRightToBracket />, text: "未出勤", class: style.end };
  };

  const { icon, text, class: attendanceClass } = getAttendanceState();

  return (
    <Layout>
      <Username />
      <Signout />
      <div className={style.wrapper}>
        <div className={`${style.currentState} ${attendanceClass}`}>
          <div className={style.iconState}>{icon}</div>
          <div>
            <p className={style.year}>
              {currentTime ? currentTime.format("YYYY年MM月DD日(dd)") : ""}
            </p>
            <div className={style.timeWrap}>
              <p className={style.time}>
                {currentTime ? currentTime.format("HH:mm:ss") : ""}
              </p>
              <p className={style.timeState}>({text})</p>
            </div>
          </div>
        </div>
        <div className={style.btnWrap}>
          <button
            className={`${style.button} ${
              startWork ? style.start : style.start
            }`}
            disabled={startWork !== null}
            onClick={handleStartWork}
          >
            <span>
              <FaRightToBracket />
            </span>
            出勤
          </button>
          <button
            className={`${style.button} ${
              isOnBreak ? style.break : style.break
            }`}
            disabled={startWork === null || endWork !== null}
            onClick={isOnBreak ? handleEndBreak : handleStartBreak}
          >
            <span>{isOnBreak ? <FaCircleStop /> : <FaCirclePlay />} </span>
            {isOnBreak ? "休憩終了" : "休憩開始"}
          </button>
          <button
            className={`${style.button} ${endWork ? style.end : style.end}`}
            disabled={startWork === null || endWork !== null || isOnBreak}
            onClick={handleEndWork}
          >
            <span>
              <FaRightFromBracket />
            </span>
            退勤
          </button>
        </div>
        <div className={style.holidayWrap}>
          {holidayBtn.map((btn, index) => (
            <button key={index} className={btn.class}>
              <span className={style.icon}>{btn.icon}</span>
              <span className={style.fontL}>{btn.text}</span>
              <span>{btn.description}</span>
              <span>{btn.description2}</span>
            </button>
          ))}
        </div>
        <div className={style.dashboard}>
          <h2>ダッシュボード</h2>
          <div className={style.information}>
            <p>Worked Hours: {calculateWorkHours()}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceChecker;
