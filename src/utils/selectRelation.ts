export const selectRelation = (
    baseFields: string[] = ['*'],
    relations?: string[],
) => {
    return [...baseFields, ...(relations || [])].join(',')
}
