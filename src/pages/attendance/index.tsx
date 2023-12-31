import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
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
  updateDoc,
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
  const [breakTimer, setBreakTimer] = useState<number | null>(null);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const db = getFirestore();
  const userDocRef = userId ? doc(db, "attendance", userId) : null;

  const getBreakDuration = () => {
    if (!startBreak || !endBreak) {
      return 0;
    }
    return endBreak.diff(startBreak, "minute");
  };

  const sendInformationToDashboard = async () => {
    try {
      if (userDocRef) {
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

  const handleResetState = async () => {
    setResetState(true);
    setStartWork(null);
    setStartBreak(null);
    setEndBreak(null);
    setEndWork(null);
    setHasEndedWork(false);
    setIsOnBreak(false);

    try {
      if (userDocRef) {
        // Update the user's latest state in Firestore after resetting the state
        await updateDoc(userDocRef, {
          startWork: null,
          startBreak: null,
          endBreak: null,
          endWork: null,
          hasEndedWork: false,
          isOnBreak: false,
          todayEvents: [],
          resetState: true,
          breakTimer: null,
        });
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleEvent = async (eventType: string) => {
    const eventTime = dayjs();
    let breakIntervalId: NodeJS.Timeout | null = null;

    try {
      if (userDocRef) {
        const eventCollectionRef = collection(userDocRef, "events");

        // Add attendance event to Firestore
        await addDoc(eventCollectionRef, {
          eventType,
          timestamp: eventTime.toISOString(),
        });

        switch (eventType) {
          case "出勤":
            if (!hasEndedWork) {
              setStartWork(eventTime);
            }
            break;

          case "休憩開始":
            setStartBreak(eventTime);
            setIsOnBreak(true);

            // Forcefully end the break after 1 hour
            setTimeout(async () => {
              await handleEvent("休憩終了");
            }, 60 * 60 * 1000);

            // Disable the "End Break" button for 1 hour
            setTimeout(() => {
              setIsOnBreak(false);
            }, 60 * 60 * 1000);

            // Start the break timer
            setBreakTimer(60 * 60); // Set the initial break duration to 1 hour

            breakIntervalId = setInterval(() => {
              setBreakTimer((prevTime) =>
                prevTime !== null ? prevTime - 1 : null
              );
            }, 1000);
            break;

          case "休憩終了":
            setEndBreak(eventTime);
            setIsOnBreak(false);
            breakIntervalId && clearInterval(breakIntervalId); // Clear the break timer interval
            break;

          case "退勤":
            setEndWork(eventTime);
            setHasEndedWork(true);
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

    if (userId) {
      sendInformationToDashboard();
    }

    let breakIntervalId: NodeJS.Timeout | null = null;

    if (isOnBreak) {
      const duration = getBreakDuration();
      const remainingTime = Math.max(0, 60 * 60 - duration);

      setBreakTimer(remainingTime);

      breakIntervalId = setInterval(() => {
        setBreakTimer((prevTime) => (prevTime !== null ? prevTime - 1 : null));
      }, 1000);
    }

    // Clear the break timer interval when the component unmounts or when the break ends
    return () => {
      clearInterval(intervalId);
      if (breakIntervalId !== null) {
        clearInterval(breakIntervalId);
      }
    };
  }, [userId, isOnBreak, startBreak, endBreak]);

  const calculateWorkHours = () => {
    if (!startWork || !hasEndedWork) {
      return "00:00:00";
    }

    const endTime = endBreak || endWork || dayjs();
    const workDurationInMinutes =
      endTime.diff(startWork, "minute") - getBreakDuration();

    const hours = Math.floor(workDurationInMinutes / 60);
    const minutes = workDurationInMinutes % 60;

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
            disabled={startWork !== null || hasEndedWork}
            onClick={() => handleEvent("出勤")}
          >
            <span>
              <FaRightToBracket />
            </span>
            出勤
          </button>
          <div>
            {isOnBreak && (
              <p className={style.breakTimer}>
                休憩終了まで{" "}
                {`${Math.floor(breakTimer! / 3600)
                  .toString()
                  .padStart(2, "0")}:${Math.floor((breakTimer! % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}:${(breakTimer! % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </p>
            )}

            <button
              className={`${style.button} ${
                isOnBreak ? style.break : style.break
              }`}
              disabled={
                isOnBreak ||
                endWork !== null ||
                startWork === null ||
                (startBreak !== null && dayjs().diff(startBreak, "hour") < 1)
              }
              onClick={() => handleEvent(isOnBreak ? "休憩終了" : "休憩開始")}
            >
              <span>{isOnBreak ? <FaCircleStop /> : <FaCirclePlay />} </span>
              {isOnBreak ? "休憩終了" : "休憩開始"}
            </button>
          </div>
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
