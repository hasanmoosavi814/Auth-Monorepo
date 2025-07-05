"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Session } from "@/types/session.types";

const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

export const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Session;
  } catch (error) {
    console.error("Invalid or expired session token:", error);
    return null;
  }
};
