'use server';
import { createClient } from "@/utils/supabase/server";

export async function DeleteAdmin(adminId: string) {
    const supabase = await createClient();

    // Delete from profiles first
    const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', adminId);

    if (profileError) {
        throw new Error(profileError.message);
    }

    // Then delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(adminId);

    if (authError) {
        throw new Error(authError.message);
    }

    return { success: true };
} 