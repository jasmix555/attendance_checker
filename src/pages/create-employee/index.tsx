// pages/create-employee-account.tsx
import { FormEvent, useState } from "react";
import style from "@/styles/registration.module.scss";
import Layout from "@/components/Layout";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";

export default function CreateEmployeeAccount() {
  const router = useRouter();
  const [employeeInfo, setEmployeeInfo] = useState({
    employee_name: "",
    login_id: "",
    password: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { companyId } = router.query; // Get companyId from the query parameter

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const db = getFirestore();

      const employeeInfoRef = collection(db, "employeeInfo");

      // Use the create user function from Firebase Authentication
      await createUserWithEmailAndPassword(
        auth,
        employeeInfo.email,
        employeeInfo.password
      );

      // Save additional employee information in the "employeeInfo" collection
      const employeeDocRef = doc(employeeInfoRef, auth.currentUser?.uid);
      await setDoc(employeeDocRef, {
        ...employeeInfo,
        uid: auth.currentUser?.uid,
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
          <div className={style.header}>従業員アカウント作成</div>
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
            <label htmlFor="email">Eメール</label>
            <input
              type="email"
              value={employeeInfo.email}
              name="email"
              id="email"
              onChange={(e) =>
                setEmployeeInfo({ ...employeeInfo, email: e.target.value })
              }
              placeholder="例: employee@example.com"
            />
          </div>
        </div>

        <div className={style.submitWrap}>
          <div>
            <button
              type="button"
              onClick={() => router.push("/create-company")}
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
