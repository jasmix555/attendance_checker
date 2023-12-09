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
import { LuTimerReset } from "react-icons/lu";
import Signout from "@/components/Signout";
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import LayoutUser from "@/components/LayoutUser";

const holidayBtn = [
  {
    icon: <FaUmbrellaBeach />,
    text: "休日申請",
    class: style.holiday,
    description: "有給休暇・特別休暇",
    description2: "体調不良・その他",
    disabled: true,
  },
  {
    icon: <FaCalendarDays />,
    text: "勤怠変更申請",
    class: style.holiday,
    description: "勤怠時間変更・その他",
    disabled: true,
  },
];

const AttendanceChecker = () => {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs | null>(null);
  const [startWork, setStartWork] = useState<dayjs.Dayjs | null>(null);
  const [startBreak, setStartBreak] = useState<dayjs.Dayjs | null>(null);
  const [endBreak, setEndBreak] = useState<dayjs.Dayjs | null>(null);
  const [endWork, setEndWork] = useState<dayjs.Dayjs | null>(null);
  const [hasEndedWork, setHasEndedWork] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [resetState, setResetState] = useState(false);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const handleEvent = async (eventType: string) => {
    const eventTime = dayjs();

    try {
      const db = getFirestore();

      if (userId) {
        const userDocRef = doc(db, "attendance", userId);
        const eventCollectionRef = collection(userDocRef, "events");

        await addDoc(eventCollectionRef, {
          eventType,
          timestamp: eventTime.toISOString(),
        });

        // Update the state and fetch information immediately after updating Firebase
        switch (eventType) {
          case "出勤":
            if (!hasEndedWork) {
              setStartWork(eventTime);
            }
            break;
          case "休憩開始":
            setStartBreak(eventTime);
            setIsOnBreak(true);
            break;
          case "休憩終了":
            setEndBreak(eventTime);
            setIsOnBreak(false);
            break;
          case "退勤":
            setEndWork(eventTime);
            setHasEndedWork(true); // Set the flag to indicate the user has ended work
            localStorage.setItem("endWorkState", "true"); // Store end work state in local storage
            localStorage.setItem("endWorkTimestamp", eventTime.toISOString()); // Store end work timestamp
            break;
          default:
            break;
        }

        sendInformationToDashboard();
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  useEffect(() => {
    dayjs.locale("ja");
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    // Fetch dashboard information on page load if userId exists
    if (userId) {
      sendInformationToDashboard();

      // Check local storage for end work state
      const storedEndWorkState = localStorage.getItem("endWorkState");
      const storedEndWorkTimestamp = localStorage.getItem("endWorkTimestamp");

      if (storedEndWorkState === "true" && storedEndWorkTimestamp) {
        // Check if 24 hours have passed since the end work timestamp
        const expirationTime = dayjs(storedEndWorkTimestamp).add(24, "hour");
        if (dayjs().isBefore(expirationTime)) {
          setEndWork(dayjs(storedEndWorkTimestamp));
          setHasEndedWork(true);
        } else {
          // Reset the stored state
          localStorage.removeItem("endWorkState");
          localStorage.removeItem("endWorkTimestamp");
        }
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [userId]);

  const sendInformationToDashboard = async () => {
    try {
      const db = getFirestore();

      if (userId) {
        const userDocRef = doc(db, "attendance", userId);

        const eventsQuery = query(
          collection(userDocRef, "events"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(eventsQuery);

        const eventsData = querySnapshot.docs.map((doc) => doc.data());
        setTodayEvents(eventsData);
      }
    } catch (error) {
      console.error("Error fetching information: ", error);
    }
  };

  const calculateWorkHours = () => {
    if (!startWork || !hasEndedWork) {
      return "00:00:00";
    }

    const endTime = isOnBreak
      ? startBreak || endWork || dayjs()
      : endBreak || endWork || dayjs();
    const durationInMinutes = endTime.diff(startWork, "minute");

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    const formattedWorkHours = String(hours).padStart(2, "0");
    const formattedWorkMinutes = String(minutes).padStart(2, "0");

    return `${formattedWorkHours}:${formattedWorkMinutes}:00`;
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

  const handleResetState = () => {
    setResetState(true); // Set the reset state flag
    setStartWork(null);
    setStartBreak(null);
    setEndBreak(null);
    setEndWork(null);
    setHasEndedWork(false);
    localStorage.removeItem("endWorkState"); // Remove end work state from local storage
    localStorage.removeItem("endWorkTimestamp"); // Remove end work timestamp from local storage
  };

  return (
    <LayoutUser>
      <Signout />
      <div className={style.wrapper}>
        <div className={style.reset}>
          <p>状態リセット</p>
          <button onClick={handleResetState}>
            <LuTimerReset />
          </button>
        </div>

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
            disabled={startWork !== null || hasEndedWork} // Disable the button if startWork is not null or hasEndedWork is true
            onClick={() => handleEvent("出勤")}
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
            onClick={() => handleEvent(isOnBreak ? "休憩終了" : "休憩開始")}
          >
            <span>{isOnBreak ? <FaCircleStop /> : <FaCirclePlay />} </span>
            {isOnBreak ? "休憩終了" : "休憩開始"}
          </button>
          <button
            className={`${style.button} ${endWork ? style.end : style.end}`}
            disabled={startWork === null || endWork !== null || isOnBreak}
            onClick={() => handleEvent("退勤")}
          >
            <span>
              <FaRightFromBracket />
            </span>
            退勤
          </button>
        </div>
        <div className={style.holidayWrap}>
          {holidayBtn.map((btn, index) => (
            <button key={index} className={btn.class} disabled={btn.disabled}>
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
            {hasEndedWork && <p>本日の出勤時間: {calculateWorkHours()}</p>}
            <p>出勤履歴:</p>
            <ul>
              {todayEvents.map((event, index) => (
                <li key={index}>
                  <span>{event.eventType}</span>
                  <div className={style.time}>
                    <span>
                      {dayjs(event.timestamp).format("YY年MM月DD日(dd)")}
                    </span>
                    <span>{dayjs(event.timestamp).format("HH:mm")}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </LayoutUser>
  );
};

export default AttendanceChecker;
