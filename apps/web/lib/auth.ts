"use server";

import { SignupFormSchema, TFormState } from "@/types/server-types";
import { SigninFormSchema } from "@/types/server-types";
import { createSession } from "./createSession";
import { BACKEND_URL } from "./constants";

export const signUp = async (
  state: TFormState | undefined,
  formData: FormData
): Promise<TFormState> => {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const parsed = SignupFormSchema.safeParse({ name, email, password });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (response.status === 409) {
      return {
        success: false,
        message: "The user already exists!",
      };
    }

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      console.error("Signup error:", result);
      return {
        success: false,
        message: response.statusText,
      };
    }

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Sign-up failed:", error);
    return {
      success: false,
      message: "Failed to connect to the server. Please try again.",
    };
  }
};

export const signIn = async (
  state: TFormState | undefined,
  formData: FormData
): Promise<TFormState> => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const parsed = SigninFormSchema.safeParse({ email, password });
  if (!parsed.success)
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };

  try {
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (response.status === 401)
      return {
        success: false,
        message: "Invalid email or password",
      };

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      console.error("Signin error:", result);
      return {
        success: false,
        message: response.statusText,
      };
    }

    const result = await response.json();
    if (!result?.user?.id || !result?.user?.name)
      return {
        success: false,
        message: "Invalid session data received from server",
      };

    await createSession({
      user: {
        id: result.user.id,
        name: result.user.name,
        role: result.user.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    console.error("Sign-in failed:", error);
    return {
      success: false,
      message: "Failed to connect to the server. Please try again.",
    };
  }
};
