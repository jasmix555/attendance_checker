import { AuthGuard } from "@/feature/auth/AuthGuard";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getFirestore, doc, getDoc } from "firebase/firestore/lite";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import Welcome from "./welcome";
import { getAuth, signOut } from "firebase/auth";
import style from "@/styles/index.module.scss";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();

        // Log the current user object
        console.log("Current User:", auth.currentUser);

        // Assuming you have the user ID stored in auth.currentUser.uid
        const userId = auth.currentUser?.uid;

        if (userId) {
          // Fetch the companyInfo document for the current user
          const companyInfoDocRef = doc(db, "companyInfo", userId);
          const companyInfoDoc = await getDoc(companyInfoDocRef);

          if (companyInfoDoc.exists()) {
            const data = companyInfoDoc.data();
            const companyName = data.company_name;
            // console.log("Company Name:", companyName);

            // Update the companyName state variable
            setCompanyName(companyName);
          } else {
            console.log(
              "CompanyInfo document does not exist for user:",
              userId
            );
          }
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching companyInfo document:", error);
      }
    };

    fetchData();
  }, [user, router]);

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
      <AuthGuard>
        {user ? (
          <>
            <div>Home</div>
            <div>
              <p>{companyName}</p>
            </div>

            <div className={style.wrapper}>
              <button
                type="button"
                onClick={() => {
                  const userId = getAuth().currentUser?.uid; // Get the current user's ID
                  const prevPath = router.pathname; // Get the current page's path
                  sessionStorage.setItem("prevPath", prevPath); // Store the prevPath in sessionStorage
                  router.push(`/create-employee?companyId=${userId}`); // Include the userId in the URL
                }}
              >
                従業員アカウント作成
              </button>
            </div>
            <button onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <Welcome />
        )}
      </AuthGuard>
    </Layout>
  );
}
