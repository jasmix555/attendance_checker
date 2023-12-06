import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import style from "@/styles/username.module.scss";

const Username = () => {
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();

        // Assuming you have the user ID stored in auth.currentUser.uid
        const userId = auth.currentUser?.uid;

        if (userId) {
          // Fetch employeeInfo document for the current user
          const employeeInfoDoc = await getDoc(doc(db, "employeeInfo", userId));

          if (employeeInfoDoc.exists()) {
            // Assuming the employee_name is stored in the 'employee_name' field
            const employeeName = employeeInfoDoc.data().employee_name;
            setEmployeeName(employeeName);
          }
        }
      } catch (error) {
        console.error("Error fetching employee name:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.logo}></div>
        <div className={style.system}>勤怠管理</div>
      </div>
      <div className={style.name}>{employeeName}さん</div>
    </div>
  );
};

export default Username;
