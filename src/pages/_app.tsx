import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { initializeFirebaseApp } from "@/firebase/config";
import { AuthProvider } from "@/feature/provider/AuthProvider";
import { useEffect, useState } from "react";

function App({ Component, pageProps }: AppProps) {
  const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeFirebaseApp();
        setFirebaseInitialized(true);
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };

    initializeApp();
  }, []);

  if (!isFirebaseInitialized) {
    // You can render a loading spinner or other UI while Firebase is initializing
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
