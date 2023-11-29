// Assuming initializeFirebaseApp returns a Promise
import type { AppProps } from "next/app";
import { initializeFirebaseApp } from "@/lib/firebase/firebase";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/feature/provider/AuthProvider";

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
