import { useState, FormEvent } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { useRouter } from "next/router";
import style from "@/styles/form.module.scss";

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
                required
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
                  required
                />
                <i onClick={handleClick}>
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
                {isLoading ? "Loading" : "Sign Up"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
