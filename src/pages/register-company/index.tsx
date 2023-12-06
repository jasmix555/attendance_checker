import { FormEvent, useState } from "react";
import style from "@/styles/registration.module.scss";
import Layout from "@/components/Layout";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";

type CompanyInfo = {
  company_name: string;
  company_id: string;
  company_pw: string;
  supervisor?: string;
  company_postal?: string;
  company_prefecture?: string;
  company_city?: string;
  company_address_detail?: string;
  company_tel?: string;
  company_email?: string;
};

export default function SignupAdmin(props: CompanyInfo) {
  const router = useRouter();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: "",
    company_id: "",
    company_pw: "",
    supervisor: "",
    company_postal: "",
    company_prefecture: "",
    company_city: "",
    company_address_detail: "",
    company_tel: "",
    company_email: "",
  });
  const prevPath = sessionStorage.getItem("prevPath");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const db = getFirestore();

      const companyInfoRef = collection(db, "companyInfo");

      // Create a new document in the "companyInfo" collection
      const companyId = auth.currentUser?.uid;
      const companyInfoDocRef = doc(companyInfoRef, companyId);

      const companyInfoDoc = await getDoc(companyInfoDocRef);

      if (companyInfoDoc.exists()) {
        await updateDoc(companyInfoDocRef, {
          ...companyInfo,
          uid: companyId,
        });
      } else {
        await setDoc(companyInfoDocRef, {
          ...companyInfo,
          uid: companyId,
        });
      }

      sessionStorage.setItem("prevPath", router.pathname);

      // Redirect to create-employee page with the companyId in the query parameter
      router.push(`/create-employee?companyId=${companyId}`);
    } catch (error) {
      console.error("Error registering company:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const db = getFirestore();
      const companyInfoRef = collection(db, "companyInfo");
      const companyId = getAuth().currentUser?.uid;
      const companyInfoDocRef = doc(companyInfoRef, companyId);
      const companyInfoDoc = await getDoc(companyInfoDocRef);

      if (companyInfoDoc.exists()) {
        setCompanyInfo(companyInfoDoc.data() as CompanyInfo);
      }
    };

    fetchCompanyInfo();
  }, []);

  return (
    <Layout>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.wrapper}>
          <div className={style.header}>会社情報</div>
          <div className={style.content}>
            <label htmlFor="company_name">会社名</label>
            <input
              type="text"
              value={companyInfo.company_name}
              name="company_name"
              id="company_name"
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, company_name: e.target.value })
              }
              placeholder="例: 株式会社〇〇"
            />
          </div>
          <div className={style.content}>
            <label htmlFor="company_id">管理者</label>
            <input
              type="text"
              value={companyInfo.company_id}
              name="company_id"
              id="company_id"
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, company_id: e.target.value })
              }
              placeholder="例: 山田 太郎"
            />
          </div>
        </div>

        <div className={style.wrapper}>
          <div className={style.header}>会社連絡先</div>
          <div className={style.content}>
            <label htmlFor="supervisor">代表者名</label>
            <input
              type="text"
              value={companyInfo.supervisor}
              name="supervisor"
              id="supervisor"
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, supervisor: e.target.value })
              }
              placeholder="例: 山田 太郎"
            />
          </div>
          <div className={style.headerSub}>住所</div>
          <div className={style.flex}>
            <div className={style.content}>
              <label htmlFor="company_postal">郵便番号</label>
              <input
                type="text"
                value={companyInfo.company_postal}
                name="company_postal"
                id="company_postal"
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    company_postal: e.target.value,
                  })
                }
                placeholder="例: 530-0015"
              />
            </div>
            <div className={style.content}>
              <label htmlFor="company_prefecture">都道府県</label>
              <input
                type="text"
                value={companyInfo.company_prefecture}
                name="company_prefecture"
                id="company_prefecture"
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    company_prefecture: e.target.value,
                  })
                }
                placeholder="例: 大阪府"
              />
            </div>
          </div>
          <div className={style.content}>
            <label htmlFor="company_city">市区町村</label>
            <input
              type="text"
              value={companyInfo.company_city}
              name="company_city"
              id="company_city"
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  company_city: e.target.value,
                })
              }
              placeholder="例: 北区中崎西"
            />
          </div>
          <div className={style.content}>
            <label htmlFor="company_address_detail">番地・建物名など</label>
            <input
              type="text"
              value={companyInfo.company_address_detail}
              name="company_address_detail"
              id="company_address_detail"
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  company_address_detail: e.target.value,
                })
              }
              placeholder="例: 2-3-15 ECCコンピュータ専門学校 2号館"
            />
          </div>

          <div className={style.content}>
            <label htmlFor="company_tel">電話番号</label>
            <input
              type="text"
              value={companyInfo.company_tel}
              name="company_tel"
              id="company_tel"
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, company_tel: e.target.value })
              }
              placeholder="例: 03-1234-5678"
            />
          </div>
          <div className={style.content}>
            <label htmlFor="company_email">メールアドレス</label>
            <input
              type="text"
              value={companyInfo.company_email}
              name="company_email"
              id="company_email"
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  company_email: e.target.value,
                })
              }
              placeholder="例: info@example.com"
            />
          </div>
        </div>

        <div className={style.submitWrap}>
          <div>
            <Link href={"/welcome"} aria-disabled>
              戻る
            </Link>
          </div>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "登録中..." : "登録"}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
