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
    const fetchUserData = async () => {
      try {
        if (user) {
          const db: Firestore = getFirestore();
          const usersCollection = collection(db, "users");
          const userDocRef = doc(usersCollection, user.uid);

          const userData = (await getDoc(userDocRef))?.data();

          if (!userData) {
            // If user data is not found, navigate to the Welcome page
            router.push("/welcome");
          }
        }
      } catch (error) {
        console.error(error);
        // Handle error as needed
      }
    };

    fetchUserData();
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
