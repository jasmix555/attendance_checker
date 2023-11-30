import Link from "next/link";
import style from "@/styles/form.module.scss";

export default function Welcome() {
  return (
    <>
      <div>Welcome</div>
      <div className={style.btnSubWrap}>
        <div className={style.buttonSub}>
          <Link href="/signin-user">従業員ログイン</Link>
        </div>
      </div>
      <div className={style.btnWrap}>
        <div className={style.button}>
          <Link href="/signup-admin">管理者新規登録</Link>
        </div>
        <div>
          <Link href="/signin-admin">管理者ログイン</Link>
        </div>
      </div>
    </>
  );
}
