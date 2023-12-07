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
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import getAuth

export default function DeleteEmployee() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(); // Use getAuth to get the authentication instance
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
        // Redirect to login page or handle unauthenticated user
        router.push("/login");
      }
    });

    fetchEmployees();

    return () => {
      authUnsubscribe();
    };
  }, [router]);

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const db = getFirestore();
      const employeeDocRef = doc(db, "employeeInfo", selectedEmployee);
      await deleteDoc(employeeDocRef);

      // Optionally, you can redirect the user to another page after successful deletion
      router.push("/welcome");
    } catch (error) {
      console.error("Error deleting employee:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        <h1>従業員削除</h1>
        <p>削除する従業員を選択してください：</p>
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              <input
                type="radio"
                id={employee.id}
                name="selectedEmployee"
                value={employee.id}
                checked={selectedEmployee === employee.id}
                onChange={() => setSelectedEmployee(employee.id)}
              />
              <label htmlFor={employee.id}>{employee.employee_name}</label>
            </li>
          ))}
        </ul>
        <button
          onClick={handleDeleteEmployee}
          disabled={!selectedEmployee || isLoading}
        >
          {isLoading ? "削除中..." : "従業員を削除"}
        </button>
      </div>
    </Layout>
  );
}
