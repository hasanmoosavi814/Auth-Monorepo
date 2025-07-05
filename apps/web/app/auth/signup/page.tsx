import SignUpForm from "@/components/templates/SignUpForm";
import Link from "next/link";
import React from "react";

const SignUp = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl font-bold mb-4">Sign Up Page</h1>
      <SignUpForm />
      <div className="flex justify-between text-sm gap-2">
        <p>Already Have an account?</p>
        <Link className="underline" href={"/auth/signin"}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
