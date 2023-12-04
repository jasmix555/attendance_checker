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
} from "react-icons/fa6";
import Layout from "@/components/Layout";
import Username from "@/components/Username";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";

const AttendanceChecker = () => {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs | null>(null);
  const [startWork, setStartWork] = useState<dayjs.Dayjs | null>(null);
  const [startBreak, setStartBreak] = useState<dayjs.Dayjs | null>(null);
  const [endBreak, setEndBreak] = useState<dayjs.Dayjs | null>(null);
  const [endWork, setEndWork] = useState<dayjs.Dayjs | null>(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const router = useRouter();

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

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default behavior of the button

    // Add a delay of 2 seconds (2000 milliseconds) before signing out
    setTimeout(async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        // Use your custom Toast component for the logout message
      } catch (e) {
        // Handle error as needed
      } finally {
        // Redirect the user to the login page after logout
        router.push("/welcome");
      }
    }, 2000); // Adjust the delay duration as needed
  };

  return (
    <Layout>
      <Username />
      <button onClick={handleSignOut}>Sign out</button>
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
          className={`${style.button} ${startWork ? style.start : style.start}`}
          disabled={startWork !== null}
          onClick={handleStartWork}
        >
          <span>
            <FaRightToBracket />
          </span>
          出勤
        </button>
        <button
          className={`${style.button} ${isOnBreak ? style.break : style.break}`}
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
      <p>Worked Hours: {calculateWorkHours()}</p>
    </Layout>
  );
};

export default AttendanceChecker;
