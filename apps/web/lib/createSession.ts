"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { Session } from "@/types/session.types";

const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

export const createSession = async (payload: Session): Promise<void> => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};
