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
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    dayjs.locale("ja");
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    // Fetch dashboard information on page load if userId exists
    if (userId) {
      sendInformationToDashboard();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [userId]);

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
            setStartWork(eventTime);
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
    if (startWork && endWork) {
      const workHours = endWork.diff(startWork, "hour");
      const workMinutes = endWork.diff(startWork, "minute") % 60;

      const formattedWorkHours = String(workHours).padStart(2, "0");
      const formattedWorkMinutes = String(workMinutes).padStart(2, "0");

      return `${formattedWorkHours}:${formattedWorkMinutes}`;
    }
    return "00:00";
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
            <p>本日の出勤時間: {calculateWorkHours()}</p>
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
    </Layout>
  );
};

export default AttendanceChecker;
