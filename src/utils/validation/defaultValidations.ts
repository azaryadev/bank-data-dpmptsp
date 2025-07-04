import { z } from 'zod'

const validationDateParams = z
    .object({
        dateFrom: z.date().nullable(),
        dateTo: z.date().nullable(),
    })
    .refine(
        (data) => {
            if (data.dateFrom && data.dateTo) {
                return data.dateFrom <= data.dateTo
            }
            return true
        },
        {
            message: 'Date From must be less than Date To',
            path: ['dateFrom'], // ini akan menentukan field form mana yang error
        },
    )


    export {
        validationDateParams
    }