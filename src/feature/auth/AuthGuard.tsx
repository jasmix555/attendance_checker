import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useAuthContext } from "../provider/AuthProvider";

type Props = { children: ReactNode };

export const AuthGuard = ({ children }: Props) => {
  const { user, loading } = useAuthContext();
  const { push } = useRouter();

  if (loading) {
    return (
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
    );
  }

  if (user === null) {
    push("/welcome");
    return null;
  }

  return <>{children}</>;
};
