import { AuthGuard } from "@/feature/auth/AuthGuard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  Firestore,
} from "firebase/firestore/lite";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import Welcome from "./welcome";
import { getAuth, signOut } from "firebase/auth";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();

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
            console.log("CompanyInfo Document ID:", companyInfoDoc.id);
            console.log("CompanyInfo Data:", companyInfoDoc.data());
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
    <>
      <AuthGuard>
        {user ? (
          <>
            <div>Home</div>
            <div>{user.uid}</div>
            <button onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <Welcome />
        )}
      </AuthGuard>
    </>
  );
}
