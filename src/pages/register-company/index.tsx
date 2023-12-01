import { useState } from "react";
import style from "@/styles/registration.module.scss";
import Layout from "@/components/Layout";

type CompanyInfo = {
  company_name: string;
  company_id: string;
  company_pw: string;
  supervisor?: string;
  company_address?: string;
  company_postal?: string;
  company_tel?: string;
  company_email?: string;
};

export default function SignupAdmin(props: CompanyInfo) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: "",
    company_id: "",
    company_pw: "",
    supervisor: "",
    company_address: "",
    company_postal: "",
    company_tel: "",
    company_email: "",
  });

  return (
    <Layout>
      <div className="wrapper">
        <div>会社情報</div>
        <div>
          <label htmlFor="company_name">会社名</label>
          <input type="text" value={""} name="company_name" id="company_name" />
        </div>
        <div>
          <label htmlFor="company_id">会社ID</label>
          <input type="text" value={""} name="company_id" id="company_id" />
        </div>
        <div>
          <label htmlFor="company_pw">パスワード</label>
          <input type="text" value={""} name="company_pw" id="company_pw" />
        </div>
      </div>
      <div className="wrapper">
        <div>会社連絡先</div>
        <div>
          <label htmlFor="supervisor">代表者名</label>
          <input type="text" value={""} name="supervisor" id="supervisor" />
        </div>
        <div className={style.address}></div>
        <div>
          <label htmlFor="company_address">住所</label>
          <input
            type="text"
            value={""}
            name="company_address"
            id="company_address"
          />
        </div>
        <div>
          <label htmlFor="company_postal">郵便番号</label>
          <input
            type="text"
            value={""}
            name="company_postal"
            id="company_postal"
          />
        </div>
        <div>
          <label htmlFor="company_tel">電話番号</label>
          <input type="text" value={""} name="company_tel" id="company_tel" />
        </div>
        <div>
          <label htmlFor="company_email">メールアドレス</label>
          <input
            type="text"
            value={""}
            name="company_email"
            id="company_email"
          />
        </div>
      </div>
    </Layout>
  );
}
