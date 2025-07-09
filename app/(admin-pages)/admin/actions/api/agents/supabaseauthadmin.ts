'use server'
import { createClient, PostgrestError } from '@supabase/supabase-js'
import { updateAgent } from '../agents/update-agent'
const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const createUser = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    tier: number;
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
    const tier = data.tier ? Number(data.tier) : null
    const result =  await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      user_metadata: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        tier: tier
      },
      email_confirm: true,
    });

    
    // await supabase.auth.signUp({
    //   email: data.email,
    //   password: data.password,
    //   options: {
    //     data: {
    //       first_name: data.first_name,
    //       last_name: data.last_name,
    //       tier: tier
    //     }
    //   }
    // })
   
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

export const updateAgentAuth = async (data: {
    id: string;
    first_name: string;
    last_name: string;
    tier: number;
    password?: string;
    email?: string;
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
  if(data.password) {
    await supabase.auth.admin.updateUserById(data.id, {
      password: data.password,
    })
  }
  if(data.email) {
    await supabase.auth.admin.updateUserById(data.id, {
      email: data.email,
    })
  }
  const result = await supabase.auth.admin.updateUserById(data.id, {
    user_metadata: {
      first_name: data.first_name,
      last_name: data.last_name,
      tier: data.tier,
    },
  });
  const result2 = await updateAgent({
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    tier: Number(data.tier),
  })
  if (typeof result2 == typeof PostgrestError) {
    return {
      error: result2
    }
  }

  if (result.error) {
    throw new Error(result.error.message)
  }
  return result
}