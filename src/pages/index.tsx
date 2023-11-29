import { useEffect } from "react";
import { useRouter } from "next/router";
import { initializeFirebaseApp } from "@/lib/firebase/firebase";

export default function Home() {
  const router = useRouter();

  //log firebase information
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeFirebaseApp();
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      <div>Home</div>
    </>
  );
}
