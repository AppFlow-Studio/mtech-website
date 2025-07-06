'use client'
import { useProfile } from '@/lib/hooks/useProfile'
import { useSignOut } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'

export default function PrivatePage() {
    const { profile } = useProfile()
    const signOut = useSignOut()
    return <div className='flex flex-col items-center justify-center h-screen'>
        <p>Hello {profile?.email}</p>
        <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
}