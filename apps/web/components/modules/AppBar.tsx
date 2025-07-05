import { getSession } from "@/lib/getSession";
import { TRole } from "@/types/role-type";

import SignInButton from "./SignInButton";
import Link from "next/link";

const AppBar = async () => {
  const session = await getSession();
  return (
    <div className="p-2 shadow flex gap-3 bg-gradient-to-br from-blue-400 to-cyan-400 text-white">
      <Link href={"/"}>Home</Link>
      {session?.user.role === TRole.ADMIN && (
        <Link href={"/dashboard"}>Dashboard</Link>
      )}
      <Link href={"/profile"}>Profile</Link>
      <SignInButton />
    </div>
  );
};

export default AppBar;
