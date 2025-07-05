import { SignOutButton } from "./SignoutButton";
import { getSession } from "@/lib/getSession";

import Link from "next/link";

const SignInButton = async () => {
  const session = await getSession();
  return (
    <div className="flex items-center gap-2 ml-auto">
      {!session || !session.user ? (
        <>
          <Link href={"/auth/signin"}>Sign In</Link>
          <Link href={"/auth/signup"}>Sign Up</Link>
        </>
      ) : (
        <>
          <p>{session.user.name}</p>
          <SignOutButton />
        </>
      )}
    </div>
  );
};

export default SignInButton;
