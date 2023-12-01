import Link from "next/link";
import style from "@/styles/welcome.module.scss";

export default function Welcome() {
  return (
    <>
      <div>Logo</div>
      <div className="buttons">
        <div className={style.user}>
          <Link href={"#"}>従業員ログイン</Link>
        </div>
        <div className={style.admin}>
          <Link href={"#"}>管理者新規登録</Link>
          <Link href={"#"}>管理者ログイン</Link>
        </div>
      </div>
    </>
  );
}
