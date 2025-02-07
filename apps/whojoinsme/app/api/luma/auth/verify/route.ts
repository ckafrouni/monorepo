import { LumaAuthService } from "@/lib/Luma";
import { NextResponse } from "next/server";
import { DB_LUMA_LINKEDIN_MUTATIONS, DB_USERS_MUTATIONS } from "@/lib/Supabase";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    const { authToken, data } = await LumaAuthService.signInWithEmailCode(
      email,
      code
    );

    const { api_id } = data;
    const luma_user_id = api_id;

    // First add to the luma_users table then login user
    try {
      await DB_LUMA_LINKEDIN_MUTATIONS.addLumaLinkedinUser(luma_user_id);
    } catch (error) {
      console.error("Error adding luma_linkedin_user:", error);
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }
    try {
      await DB_USERS_MUTATIONS.loginLumaUser(email, luma_user_id);
    } catch (error) {
      console.error("Error logging in luma_user:", error);
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }

    return NextResponse.json({ authToken, data });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
