"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import SubmitButton from "../modules/SubmitButton";

const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  const router = useRouter();

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Sign up Created Successfully!");
      router.push("/auth/signin");
    } else {
      if (state.message) toast.error(state.message);
      const errors = state.errors ?? {};
      if (errors.name) toast.error(`Name: ${errors.name[0]}`);
      if (errors.email) toast.error(`Email: ${errors.email[0]}`);
      if (errors.password) toast.error(`Password: ${errors.password[0]}`);
    }
  }, [state, router]);

  return (
    <form className="flex flex-col gap-4" action={action}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" placeholder="Your full name" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton>Sign Up</SubmitButton>
    </form>
  );
};

export default SignUpForm;
