import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/getSession";

export const middleware = async (req: NextRequest) => {
  const session = await getSession();
  if (!session || !session.user)
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  NextResponse.next();
};

export const config = {
  matcher: ["/profile"],
};
