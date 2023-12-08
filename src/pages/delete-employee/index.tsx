import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import {
  getFirestore,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import style from "@/styles/delete.module.scss";
import { deleteUser, getAuth, onAuthStateChanged } from "firebase/auth";

export default function DeleteEmployee() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (user) {
          const companyId = router.query.companyId as string;

          const db = getFirestore();
          const employeesQuery = query(
            collection(db, "employeeInfo"),
            where("companyId", "==", companyId)
          );

          const employeeSnapshot = await getDocs(employeesQuery);

          const employeeList = employeeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setEmployees(employeeList);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        // Handle error
      }
    };

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/welcome");
      }
    });

    fetchEmployees();

    return () => {
      authUnsubscribe();
    };
  }, [router]);

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployee((prevSelectedEmployee) =>
      prevSelectedEmployee === employeeId ? null : employeeId
    );
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const db = getFirestore();
      const employeeDocRef = doc(db, "employeeInfo", selectedEmployee);

      // Get the user ID from the Firestore document
      const employeeSnapshot = await getDoc(employeeDocRef);
      const employeeData = employeeSnapshot.data();

      // Check if employeeData is defined before accessing properties
      const userId = employeeData?.uid;

      if (!userId) {
        console.error("User ID not found in employeeData");
        return;
      }

      // Delete the document in Firestore
      await deleteDoc(employeeDocRef);

      // Delete the user in Firebase Authentication
      const auth = getAuth();
      const userToDelete = await getDoc(doc(db, "employeeInfo", userId));
      const userData = userToDelete.data();

      // Check if userData is defined before deleting the user
      if (userData?.login_id) {
        await deleteUser(auth.currentUser!); // Delete the currently authenticated user
      }

      router.push("/");
    } catch (error) {
      console.error("Error deleting employee:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className={style.wrapper}>
        <div className={style.header}>従業員削除</div>
        <div className={style.content}>
          <div className={style.phrase}>削除する従業員を選択してください：</div>
          <ul>
            {employees.map((employee) => (
              <li key={employee.id}>
                <input
                  type="checkbox"
                  id={employee.id}
                  name="selectedEmployee"
                  value={employee.id}
                  defaultChecked={selectedEmployee === employee.id}
                  onChange={() => handleSelectEmployee(employee.id)}
                />
                <label htmlFor={employee.id}>{employee.employee_name}</label>
              </li>
            ))}
          </ul>
        </div>
        <div className={style.btnWrap}>
          <button className={style.back} onClick={() => router.push("/")}>
            戻る
          </button>
          <button
            onClick={handleDeleteEmployee}
            disabled={!selectedEmployee || isLoading}
          >
            {isLoading ? "削除中..." : "従業員を削除"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
