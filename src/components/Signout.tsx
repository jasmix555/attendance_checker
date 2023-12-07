import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import style from "@/styles/signout.module.scss";

export default function Signout() {
  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default behavior of the button

    // Add a delay of 2 seconds (2000 milliseconds) before signing out
    setTimeout(async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        // Use your custom Toast component for the logout message
      } finally {
        // Redirect the user to the login page after logout
        router.push("/");
      }
    }, 2000); // Adjust the delay duration as needed
  };

  return (
    <div className={style.btnWrap}>
      <button onClick={handleSignOut}>サインアウト</button>
    </div>
  );
}
