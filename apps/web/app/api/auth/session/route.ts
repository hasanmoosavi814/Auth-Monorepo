import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Session } from "@/types/session.types";

const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return NextResponse.json(null, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json(payload as Session);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(null, { status: 401 });
  }
}
