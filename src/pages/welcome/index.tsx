import Link from "next/link";

export default function Welcome() {
  return (
    <>
      <div>Welcome</div>
      <div>
        <Link href="/signin">SignIn</Link>
      </div>
    </>
  );
}
