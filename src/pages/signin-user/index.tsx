// pages/signin-employee.tsx
import { FormEvent, useState } from "react";
import style from "@/styles/input.module.scss";
import Layout from "@/components/Layout";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignInEmployee() {
  const router = useRouter();
  const [signInInfo, setSignInInfo] = useState({
    login_id: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      // Use the sign in function from Firebase Authentication
      await signInWithEmailAndPassword(
        auth,
        signInInfo.login_id,
        signInInfo.password
      );

      // Redirect the user to the dashboard or any other protected page
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Invalid login credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSignIn} className={style.form}>
        <div className={style.wrapper}>
          <div className={style.header}>従業員ログイン</div>
          {error && <div className={style.error}>{error}</div>}
          <div className={style.inputWrapper}>
            <input
              type="text"
              value={signInInfo.login_id}
              name="login_id"
              id="login_id"
              onChange={(e) =>
                setSignInInfo({ ...signInInfo, login_id: e.target.value })
              }
              placeholder="従業員IDを入力"
            />
            <label htmlFor="login_id">ログインID</label>
          </div>
          <div className={style.inputWrapper}>
            <input
              type="password"
              value={signInInfo.password}
              name="password"
              id="password"
              onChange={(e) =>
                setSignInInfo({ ...signInInfo, password: e.target.value })
              }
              placeholder="パスワードを入力"
            />
            <label htmlFor="password">パスワード</label>
          </div>
        </div>

        {/* <div className={style.submitWrap}>
          <div>
            <button type="button" onClick={() => router.push("/welcome")}>
              戻る
            </button>
          </div>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </div>
        </div> */}
        <div className={style.submitWrap}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "作成中" : "作成"}
          </button>
          <Link href={"/welcome"}>戻る</Link>
        </div>
      </form>
    </Layout>
  );
}
