import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import style from "@/styles/username.module.scss";

const Username = () => {
  const [employeeName, setEmployeeName] = useState("");
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming you have the user ID stored in auth.currentUser.uid
        const userId = auth.currentUser?.uid;

        if (userId) {
          // Fetch employeeInfo document for the current user
          const employeeInfoDoc = await getDoc(
            doc(getFirestore(), "employeeInfo", userId)
          );

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

    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(); // Fetch data when the user is authenticated
      } else {
        setEmployeeName(""); // Clear the name when the user is not authenticated
      }
    });

    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, [auth]); // Dependency on auth to ensure the effect is re-run when auth changes

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.logo}></div>
        <div className={style.system}>勤怠管理</div>
      </div>
      <div className={style.name}>
        {employeeName ? `${employeeName}さん` : "ゲストさん"}
      </div>
    </div>
  );
};

export default Username;
