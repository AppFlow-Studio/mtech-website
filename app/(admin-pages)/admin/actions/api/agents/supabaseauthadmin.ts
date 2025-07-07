'use server'
import { createClient } from '@supabase/supabase-js'
const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const createUser = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    tier: string;
  }) => {
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
    // Access auth admin api
    const result = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      user_metadata: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        tier: data.tier,
      },
      email_confirm: true,
    });
    if (result.error) {
        throw new Error(result.error.message)
    }
    return result;
  };

export const deleteUser = async (id : string) => {
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
    const result = await supabase.auth.admin.deleteUser(id)
    if (result.error) {
        throw new Error(result.error.message)
    }
    return result
}