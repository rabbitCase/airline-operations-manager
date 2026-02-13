import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  console.log("reached");
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } else {
    await auth.api.revokeOtherSessions();
    console.log("called");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: "ADMIN",
    },
  });

  return NextResponse.json({ ok: true });
}
