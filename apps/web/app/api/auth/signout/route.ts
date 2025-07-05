import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteSession } from "@/lib/deleteSession";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";

export const GET = async (req: NextRequest) => {
  const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });
  if (response.ok) await deleteSession();
  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  return NextResponse.redirect(new URL("/", req.nextUrl));
};
