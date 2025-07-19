'use server';
import { createClient, PostgrestError } from '@supabase/supabase-js'
const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY!
export async function CreateAdmin(adminData: {
    first_name: string;
    last_name: string;
    email: string;
    tier: number | undefined;
    password: string;
    role: 'ADMIN' | 'MASTER_ADMIN';
}) {
    const supabase = createClient(
        supabase_url,
        service_role_key,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
      console.log(adminData)

    // First create the user in auth

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password,
        user_metadata: {
            email: adminData.email,
            first_name: adminData.first_name,
            last_name: adminData.last_name,
            tier : null,
            role: adminData.role,
        },
        email_confirm: true,
    });

    if (authError) {
        throw new Error(authError.message);
    }

    return authData

    // Then create the profile
    // const { data: profileData, error: profileError } = await supabase
    //     .from('profiles')
    //     .insert({
    //         id: authData.user.id,
    //         first_name: adminData.first_name,
    //         last_name: adminData.last_name,
    //         email: adminData.email,
    //         role: adminData.role
    //     });

    // if (profileError) {
    //     throw new Error(profileError.message);
    // }

    // return profileData;
} 