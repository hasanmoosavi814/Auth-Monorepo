import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/createSession";
import { TRole } from "@/types/role-type";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const role = searchParams.get("role");

  if (!accessToken || !refreshToken || !userId || !name || !role) {
    return new NextResponse("Missing required query parameters", {
      status: 400,
    });
  }

  await createSession({
    user: {
      id: userId,
      name,
      role: role as TRole,
    },
    accessToken,
    refreshToken,
  });

  return NextResponse.redirect(new URL("/", req.url));
}
