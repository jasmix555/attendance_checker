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
import Signout from "@/components/Signout";
import Username from "@/components/Username";

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

  return (
    <Layout>
      <AuthGuard>
        {user ? (
          <>
            <div className={style.heading}>
              <p>株式会社{companyName}</p>
            </div>
            <div className={style.option}>
              <div className={style.content}>
                <Link href="/register-company">会社情報編集</Link>
              </div>

              <div className={style.content}>
                <button
                  type="button"
                  onClick={() => {
                    const userId = getAuth().currentUser?.uid; // Get the current user's ID
                    const prevPath = router.pathname; // Get the current page's path
                    sessionStorage.setItem("prevPath", prevPath); // Store the prevPath in sessionStorage
                    router.push(`/create-employee?companyId=${userId}`); // Include the userId in the URL
                  }}
                >
                  従業員
                  <br />
                  アカウント作成
                </button>
              </div>
            </div>
            <Signout />
          </>
        ) : (
          <Welcome />
        )}
      </AuthGuard>
    </Layout>
  );
}
