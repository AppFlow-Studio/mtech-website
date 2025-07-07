export async function getProducts() {
    const response = await fetch('/api/admin/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch products')
    }

    return response.json()
}