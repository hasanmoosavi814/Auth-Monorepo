"use server";

import { createSession } from "./createSession";
import { jwtVerify } from "jose";
import { Session } from "@/types/session.types";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

export const updateToken = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return;

  const { payload } = await jwtVerify<Session>(token, JWT_SECRET);
  if (
    !payload.user ||
    typeof payload.user.id !== "string" ||
    typeof payload.user.name !== "string"
  )
    throw new Error("Invalid session payload structure");

  const newPayload: Session = {
    user: payload.user,
    accessToken,
    refreshToken,
  };

  await createSession(newPayload);
};
