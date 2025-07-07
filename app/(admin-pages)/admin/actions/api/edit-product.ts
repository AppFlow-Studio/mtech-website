export async function editProduct({ id, ...data }: { id: string;[key: string]: any }) {
    const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error('Failed to edit product')
    }

    return response.json()
}