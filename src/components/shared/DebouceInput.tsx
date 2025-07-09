"use client"

import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import type { ChangeEvent, Ref } from 'react'
import type { InputProps } from '@/components/ui/Input'
import React from 'react'

// DebounceInputProps typo fixed
// Also, use value prop for debouncing

type DebouceInputProps = InputProps & {
    wait?: number
    ref?: Ref<HTMLInputElement>
}

const DebouceInput = (props: DebouceInputProps) => {
    const { wait = 500, ref, value: valueProp, onChange, ...rest } = props
    const [inputValue, setInputValue] = React.useState(valueProp || '')
    const debouncedValue = useDebounce(inputValue as string, wait)

    React.useEffect(() => {
        if (onChange) {
            // Create a synthetic event to pass to onChange
            const event = { target: { value: debouncedValue } } as ChangeEvent<HTMLInputElement>
            onChange(event)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    return <Input ref={ref} {...rest} value={inputValue} onChange={handleInputChange} />
}

export default DebouceInput
