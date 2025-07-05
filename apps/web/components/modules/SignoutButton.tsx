"use client";

import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout");
    router.refresh();
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};
