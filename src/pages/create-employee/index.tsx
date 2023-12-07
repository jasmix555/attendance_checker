import { FormEvent, useState, useEffect } from "react";
import style from "@/styles/registration.module.scss";
import Layout from "@/components/Layout";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";

export default function CreateEmployeeAccount() {
  const router = useRouter();
  const prevPath = sessionStorage.getItem("prevPath");
  const [employeeInfo, setEmployeeInfo] = useState({
    employee_name: "",
    login_id: "",
    password: "",
    companyId: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { companyId } = router.query; // Get companyId from the query parameter

  useEffect(() => {
    // Check if companyId is a string before updating the state
    if (typeof companyId === "string") {
      setEmployeeInfo((prevInfo) => ({ ...prevInfo, companyId: companyId }));
    }
  }, [companyId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const db = getFirestore();

      const employeeInfoRef = collection(db, "employeeInfo");

      // Use the create user function from Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        employeeInfo.login_id,
        employeeInfo.password
      );

      // Save additional employee information in the "employeeInfo" collection
      const employeeDocRef = doc(employeeInfoRef, userCredential.user.uid);
      await setDoc(employeeDocRef, {
        ...employeeInfo,
        uid: userCredential.user.uid,
        companyId: companyId, // Save the companyId
      });

      // Optionally, you can redirect the user to another page after successful registration
      router.push("/");
    } catch (error) {
      console.error("Error creating employee account:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.wrapper}>
          <div className={style.header}>アカウント作成</div>
          <div className={style.content}>
            <label htmlFor="company_id">会社ID</label>
            <input
              type="text"
              value={employeeInfo.companyId}
              name="company_id"
              id="company_id"
              readOnly
            />
          </div>
          <div className={style.content}>
            <label htmlFor="employee_name">従業員名</label>
            <input
              type="text"
              value={employeeInfo.employee_name}
              name="employee_name"
              id="employee_name"
              onChange={(e) =>
                setEmployeeInfo({
                  ...employeeInfo,
                  employee_name: e.target.value,
                })
              }
              placeholder="例: 山田花子"
            />
          </div>
          <div className={style.content}>
            <label htmlFor="login_id">ログインID</label>
            <input
              type="text"
              value={employeeInfo.login_id}
              name="login_id"
              id="login_id"
              onChange={(e) =>
                setEmployeeInfo({ ...employeeInfo, login_id: e.target.value })
              }
              placeholder="例: employee123"
            />
          </div>
          <div className={style.content}>
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              value={employeeInfo.password}
              name="password"
              id="password"
              onChange={(e) =>
                setEmployeeInfo({ ...employeeInfo, password: e.target.value })
              }
              placeholder="例: ******"
            />
          </div>
          <div className={style.content}>
            <label htmlFor="role">役割</label>
            <select
              name="role"
              id="role"
              value={employeeInfo.role || "employee"} // Set the default value to "employee"
              onChange={(e) =>
                setEmployeeInfo({ ...employeeInfo, role: e.target.value })
              }
            >
              <option value="admin">管理者</option>
              <option value="observer">責任者</option>
              <option value="employee">従業員</option>
            </select>
          </div>
        </div>
        <div className={style.submitWrap}>
          <div>
            <button
              type="button"
              onClick={() => {
                if (typeof prevPath === "string") {
                  router.push(prevPath); // Navigate back to the previous page
                } else {
                  // Handle the case when prevPath is null
                  // For example, navigate to a default page
                  router.push("/");
                }
              }}
            >
              戻る
            </button>
          </div>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "登録中..." : "登録"}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
