"use server";

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
