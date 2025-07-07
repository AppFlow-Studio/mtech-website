export async function getAgents() {
    const response = await fetch('/admin/actions/api/agents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch agents')
    }

    return response.json()
}