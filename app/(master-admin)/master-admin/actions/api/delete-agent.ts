import { NextResponse } from "next/server"

export async function deleteAgent(id: string) {
    try {
        const response = await fetch('/master-admin/actions/api/agents', {
            method: 'DELETE',
            body: JSON.stringify({ id })
        })
        if (!response.ok) {
            throw new Error('Failed to delete agent')
        }
        return response.json()
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}