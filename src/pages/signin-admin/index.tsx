// Import necessary modules and styles
import { FormEvent, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { useRouter } from "next/router";
import style from "@/styles/form.module.scss";
import { getDoc, doc, getFirestore } from "firebase/firestore/lite";
import Link from "next/link";

export default function SigninAdmin() {
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

      try {
        push("/");
      } catch (error) {
        console.error("Error checking profile setup:", error);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      checkProfileSetup();
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error("Firebase Error:", e.message);
      }
    } finally {
    }
  };

  return (
    <>
      <div className={style.bodyWrap}>
        <form onSubmit={handleSubmit}>
          <div className={style.contentWrap}>
            <div className={style.inputWrap}>
              <p>E-Mail</p>
              <input
                className={style.input}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={style.inputWrap}>
              <p>Password</p>
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
                  {show ? (
                    <p
                      style={{
                        outline: "solid 1px #333",
                        cursor: "pointer",
                        width: "10rem",
                        textAlign: "center",
                        fontStyle: "normal",
                      }}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      style={{
                        outline: "solid 1px #333",
                        cursor: "pointer",
                        width: "10rem",
                        textAlign: "center",
                        fontStyle: "normal",
                      }}
                    >
                      Show
                    </p>
                  )}
                </i>
              </div>
            </div>
            <div className={style.submitWrap}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "ログイン中..." : "ログイン"}
              </button>
            </div>
            <Link href={"./signup"}>Sign Up</Link>
          </div>
        </form>
      </div>
    </>
  );
}
