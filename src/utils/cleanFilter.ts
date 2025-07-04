export const cleanFilter = (filters: Record<string, string>) => {
    const result: Record<string, string> = {}
  
    for (const key in filters) {
      const val = filters[key]?.trim()
      if (!val) continue
  
      // Jika key mengandung titik, berarti kita kasih operator manual (contoh: created_at.gte)
      if (key.includes('.')) {
        const [field, operator] = key.split('.')
        result[field] = `${operator}.${val}`
      } else {
        // default: ilike
        result[key] = `ilike.*${val}*`
      }
    }
  
    return result
  }