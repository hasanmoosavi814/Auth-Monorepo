import SignInForm from "@/components/templates/SignInForm";
import { BACKEND_URL } from "@/lib/constants";

const SignIn = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl font-semibold mb-4">Sign In</h1>
      <div className="flex flex-col gap-2">
        <SignInForm />
        <hr />
        <a
          href={`${BACKEND_URL}/auth/google/login`}
          className="border px-4 py-2 rounded bg-sky-600 text-white text-center"
        >
          Sign In With Google
        </a>
      </div>
    </div>
  );
};

export default SignIn;
