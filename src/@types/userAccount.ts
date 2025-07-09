export type userAccountData = {
    id?: string
    email?: string
    created_at?: string
    role_id?: string
    first_name?: string
    last_name?: string
    roles?: {
        id: string
        name: string
    }
}

export type RolesData = {
    id?: string
    name?: string
    description?: string
    created_at?: string
}
