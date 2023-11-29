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

  return (
    <>
      <AuthGuard>
        {user ? (
          <>
            <div>Home</div>
          </>
        ) : (
          <Welcome />
        )}
      </AuthGuard>
    </>
  );
}
