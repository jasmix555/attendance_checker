import { useState, FormEvent } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/input.module.scss";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      // Registration successful, redirect to the profile setup page
      setEmail("");
      setPassword("");
      router.push("/signin");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className={style.bodyWrap}>
        <form onSubmit={handleSubmit}>
          <div className={style.contentWrap}>
            <div className={style.inputWrap}>
              <p>E-Mail</p>
              <input
                autoComplete="off"
                className={style.input}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={style.inputWrap}>
              <p>Password</p>
              <div className={style.iconVis}>
                <input
                  autoComplete="new-password"
                  className={style.input}
                  type={show ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i onClick={handleClick}>
                  {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                </i>
              </div>
            </div>
            <div className={style.submitWrap}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "作成中" : "新規登録"}
              </button>
              <div>
                <Link href={"/welcome"}>戻る</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
