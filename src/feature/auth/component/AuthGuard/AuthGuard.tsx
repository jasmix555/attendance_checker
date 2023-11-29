import { useAuthContext } from "@/feature/provider/AuthProvider";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const { user } = useAuthContext();
  const { push } = useRouter();

  if (typeof user === "undefined") {
    return <div>読み込み中...</div>;
  }

  if (user === null) {
    push("/");
    return null;
  }

  return <>{children}</>;
};
