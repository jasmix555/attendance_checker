import Link from "next/link";
import style from "@/styles/welcome.module.scss";
import Layout from "@/components/Layout";

export default function Administrator() {
  return (
    <Layout>
      <div className={style.logo}></div>

      <div className={style.btnSubWrap}>
        <div className={style.buttonSub}>
          <Link href={"/welcome"}>テスト用従業員ページ</Link>
        </div>
      </div>

      <div className={style.btnWrap}>
        <div className={style.button}>
          <Link href={"/signup-admin"}>管理者新規登録</Link>
        </div>
        <div>
          <Link href={"/signin-admin"}>管理者ログイン</Link>
        </div>
      </div>
    </Layout>
  );
}
