import Layout from "@/components/Layout";
import Link from "next/link";
import style from "@/styles/welcome.module.scss";

export default function Welcome() {
  return (
    <Layout>
      <div className={style.logo}></div>

      <div className={style.btnSubWrap}>
        <div className={style.buttonSub}>
          <Link href={"/administrator"}>テスト用管理者ページ</Link>
        </div>
      </div>

      <div className={style.btnWrap}>
        <div className={style.button}>
          <Link href={"/signin-user"}>従業員ログイン</Link>
        </div>
      </div>
    </Layout>
  );
}
