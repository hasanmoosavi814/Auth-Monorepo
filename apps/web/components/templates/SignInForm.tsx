"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Label } from "../ui/label";

import SubmitButton from "../modules/SubmitButton";
import Link from "next/link";

const SignInForm = () => {
  // =========== Router =============
  const router = useRouter();

  // =========== Action =============
  const [state, action] = useActionState(signIn, undefined);

  // =========== Effect =============
  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Sign In Successfully!");
      router.push("/");
    } else {
      if (state.message) toast.error(state.message);
      const errors = state.errors ?? {};
      if (errors.email) toast.error(`Email: ${errors.email[0]}`);
      if (errors.password) toast.error(`Password: ${errors.password[0]}`);
    }
  }, [state, router]);

  // =========== Rendering =============
  return (
    <form action={action}>
      <div className="flex flex-col gap-2 w-64">
        <div>
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            type="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="*********"
          />
        </div>
        <Link className="text-sm underline" href={"#"}>
          Forgot Password?
        </Link>
        <SubmitButton>Sign In</SubmitButton>
        <div className="flex justify-between text-sm">
          <p>Dont&apos;s have an account?</p>
          <Link href={"/auth/signup"} className="text-sm underline">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
