import { NextResponse } from "next/server";
import { DB_LUMA_LINKEDIN_MUTATIONS } from "@/lib/Supabase";

export async function POST(request: Request) {
  try {
    const { userId, aiResult } = await request.json();

    if (!userId || !aiResult) {
      return NextResponse.json(
        { error: "User ID and AI response are required" },
        { status: 400 }
      );
    }

    await DB_LUMA_LINKEDIN_MUTATIONS.updateAiSummary(userId, aiResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating AI summary:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
