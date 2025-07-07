'use client'
import { useProfile } from "@/lib/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { useSignOut } from "@/lib/auth-utils"
export default function AgentPage() {
    const { profile } = useProfile()
    const signOut = useSignOut()
    return <div>
        <h1>Agent Page</h1>
        <p>Hello {profile?.email}</p>
        <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
}