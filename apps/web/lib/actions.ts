"use server";

import { TUploadFormState, UploadFormSchema } from "@/types/server-types";
import { BACKEND_URL } from "./constants";
// import { getSession } from "./getSession";
import { authFetch } from "./authFetch";

export const getProfile = async () => {
  // const session = await getSession();
  // if (!session?.accessToken)
  //   throw new Error("No access token found in session.");
  // const response = await fetch(`${BACKEND_URL}/auth/protected`, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${session.accessToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error("Failed to fetch protected profile.");
  const response = await authFetch(`${BACKEND_URL}/auth/protected`);
  const result = await response.json();
  return result;
};

export const uploadFileToServer = async (
  state: TUploadFormState,
  formData: FormData
): Promise<TUploadFormState> => {
  const file = formData.get("file");
  const validated = UploadFormSchema.safeParse({ file });
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }
  const response = await fetch(`${BACKEND_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    return { message: "✅ Success! File uploaded." };
  } else {
    return { message: "❌ Oops, something went wrong." };
  }
};
