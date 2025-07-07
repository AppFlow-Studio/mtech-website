export async function removeProduct(productId: string) {
    const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to remove product')
    }

    return response.json()
}