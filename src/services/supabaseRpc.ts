/* eslint-disable @typescript-eslint/no-explicit-any */
export async function callSupabaseRPC<T = any>(
    functionName: string,
): Promise<T> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${functionName}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: process.env.NEXT_SUPABASE_API_KEY!,
            },
            // Cache options (opsional):
            // next: { revalidate: 0 }, // Untuk server fetch tanpa cache
        },
    )

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to call Supabase RPC')
    }

    return res.json()
}
