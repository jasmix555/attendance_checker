import Layout from "@/components/Layout";
import Link from "next/link";
import style from "@/styles/created.module.scss";

export default function EmployeeCreated() {
  return (
    <Layout>
      <div className={style.wrapper}>
        <div className={style.verified}>アカウント作成が完了しました!</div>
        <div className={style.btnWrap}>
          <Link href={"/"} className={style.back}>
            トップページへ
          </Link>
          <Link href={"/create-employee"}>再作成する</Link>
        </div>
      </div>
    </Layout>
  );
}
