"use server";

import { BACKEND_URL } from "./constants";

export const refreshToken = async (
  oldRefreshToken: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: oldRefreshToken }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token");
      return false;
    }

    const data: {
      accessToken: string;
      refreshToken: string;
    } = await response.json();

    const { accessToken, refreshToken } = data;

    if (!accessToken || !refreshToken) {
      throw new Error("Incomplete token data from backend");
    }

    const updateResponse = await fetch(
      "http://localhost:3000/api/auth/update",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      }
    );

    if (!updateResponse.ok) {
      console.error("Failed to update tokens");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in refreshToken:", error);
    return false;
  }
};
