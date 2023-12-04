// Import necessary modules and styles
import { FormEvent, useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/input.module.scss";
import { getDoc, doc, getFirestore } from "firebase/firestore/lite";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function Signin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const auth = getAuth();

  // Check if the user's profile setup is complete
  const checkProfileSetup = async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, "companies", user.uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);
        userDocSnapshot.exists()
          ? push("/attendance")
          : push("/register-company");
      } catch (error) {
        console.error("Error checking profile setup:", error);
      }
    }
  };

  useEffect(() => {
    // Check the profile setup when the component loads
    checkProfileSetup();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      checkProfileSetup();
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className={style.form} autoComplete="off">
        <div className={style.wrapper}>
          <div className={style.header}>ログイン</div>
          <div className={style.inputWrapper}>
            <label htmlFor="email">メール</label>
            <input
              className={style.input}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={style.inputWrapper}>
            <label htmlFor="password">パスワード</label>
            <div className={style.iconVis}>
              <input
                className={style.input}
                type={show ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                onClick={handleClick}
                title={show ? "Hide Password" : "Show Password"}
              >
                {show ? <AiFillEyeInvisible /> : <AiFillEye />}
              </i>
            </div>
          </div>
          <div className={style.submitWrap}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
            <Link href={"/welcome"}>戻る</Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}
