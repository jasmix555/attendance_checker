import Layout from "@/components/Layout";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (typeof user === "undefined") {
      // Still loading, do nothing
      return;
    }

    if (user === null) {
      // User is not authenticated, redirect to the welcome page
      router.replace("/welcome");
    }
  }, [user, router]);

  if (typeof user === "undefined") {
    // Render a loading indicator
    return (
      <Layout>
        <div
          style={{
            fontSize: "5rem",
            textAlign: "center",
            display: "flex",
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            background: "var(--main-color)",
          }}
        >
          読み込み中...
        </div>
      </Layout>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};
