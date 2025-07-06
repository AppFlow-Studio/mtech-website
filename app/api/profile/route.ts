// src/app/api/profile/route.ts
import { withAuth } from "@/lib/api/with-auth";
import { createClient } from "@/utils/supabase/server";
import { profileSchema } from "@/lib/validations/profiles";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return withAuth(request, async (user) => {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = await createClient();
    const { data : user_profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return NextResponse.json({ data: user_profile });
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const body = await request.json();
      const validatedData = profileSchema.parse(body);

      const supabase = await createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          ...validatedData,
        },
      });

      if (error) throw error;

      return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }
  });
}