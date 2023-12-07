import { useState, FormEvent } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
  AuthError,
} from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/input.module.scss";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDoc,
} from "firebase/firestore";

const EMAIL_ALREADY_IN_USE = "auth/email-already-in-use";
const WEAK_PASSWORD = "auth/weak-password";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const router = useRouter();

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setEmailError("");
      setPasswordError("");

      const auth = getAuth();
      const db = getFirestore();

      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      const existingData = await getDoc(
        doc(db, "companyAdmins", userCredential.user.uid)
      );

      const companyAdmins = collection(db, "companyAdmins");

      // Check if existingData exists and use it, otherwise, use an empty object
      const dataToSet = existingData.exists() ? existingData.data() : {};

      await setDoc(doc(companyAdmins, userCredential.user.uid), {
        ...dataToSet,
        email: userCredential.user.email,
        uid: userCredential.user.uid,
      });

      // Redirect all users to the "/signin-admin" page after registration
      router.push("/signin-admin");

      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      console.error(error);

      if (error && typeof error === "object" && "code" in error) {
        const errorCode = (error as { code: string }).code;

        if (errorCode === EMAIL_ALREADY_IN_USE) {
          setEmailError("このメールアドレスは既に使用されています");
        } else if (errorCode === WEAK_PASSWORD) {
          setPasswordError("パスワードが弱すぎます");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className={style.form} autoComplete="off">
        <div className={style.wrapper}>
          <div className={style.header}>新規登録</div>

          <div className={style.inputWrapper}>
            <input
              autoComplete="off"
              className={style.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">メール</label>
            {emailError && <p className={style.error}>{emailError}</p>}
          </div>
          <div className={style.inputWrapper}>
            <input
              autoComplete="new-password"
              className={style.input}
              type={show ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">パスワード</label>
            <i onClick={handleClick}>
              {show ? <AiFillEyeInvisible /> : <AiFillEye />}
            </i>
            {passwordError && <p className={style.error}>{passwordError}</p>}
          </div>
          <div className={style.submitWrap}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "作成中" : "作成"}
            </button>
            <Link href={"/welcome"}>戻る</Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}
