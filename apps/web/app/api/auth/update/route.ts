import { updateToken } from "@/lib/updateToken";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken, refreshToken } = body;
  if (!accessToken || !refreshToken)
    return new Response("Provide Tokens", { status: 401 });
  await updateToken({ accessToken, refreshToken });
  return new Response("OK", { status: 200 });
}
