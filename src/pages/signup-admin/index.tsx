import { useState, FormEvent } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/registration.module.scss";

export default function RegisterAdmin() {
  const [displayName, setDisplayName] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [representativeName, setRepresentativeName] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [prefecture, setPrefecture] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>(""); // Add this line
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, companyId);
      await sendEmailVerification(userCredential.user);

      // Registration successful, redirect to the next page
      router.push("/signin");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={style.pagination}></div>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.wrapper}>
          <h1>会社情報</h1>
          <div className={style.content}>
            <p>表示名</p>
            <input
              placeholder="株式会社〇〇"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className={style.content}>
            <p>会社ID</p>
            <input
              type="text"
              placeholder="会社IDを入力してください"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            />
          </div>
        </div>
        <div className={style.wrapper}>
          <h1>会社連絡先</h1>
          <div className={style.content}>
            <p>代表者名</p>
            <input
              type="text"
              placeholder="山田 太郎"
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
            />
          </div>
          <div className={style.address}>
            <h2>住所</h2>
            <div className={style.content}>
              <p>郵便番号</p>
              <input
                type="text"
                placeholder="000-0000"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className={style.content}>
              <p>都道府県</p>
              <input type="text" placeholder="大阪府" readOnly />
            </div>
          </div>
          <div className={style.content}>
            <p>市区町村</p>
            <input
              type="text"
              placeholder="北区中崎西"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className={style.content}>
            <p>番地・建物名など</p>
            <input
              type="text"
              value={streetAddress}
              placeholder="2-3-15 ECCコンピュータ専門学校 2号館"
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div>
          <div className={style.content}>
            <p>電話番号</p>
            <input
              type="tel"
              required
              placeholder="06-1234-5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className={style.content}>
            <p>メールアドレス</p>
            <input
              type="email"
              value={email}
              placeholder="company@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className={style.submitWrap}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading" : "Sign Up"}
          </button>
        </div>
      </form>
    </>
  );
}
