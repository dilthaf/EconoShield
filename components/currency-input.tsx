"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CurrencyInputProps {
  id?: string
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
}

export function CurrencyInput({ 
  id, 
  value = "", 
  placeholder = "0", 
  onChange,
  className = ""
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setDisplayValue(formatCurrency(value))
  }, [value])

  const formatCurrency = useCallback((val: string): string => {
    if (!val) return ""
    
    // Remove all non-digit characters except minus sign at the beginning
    const numericValue = val.replace(/[^\d-]/g, "")
    
    if (!numericValue) return ""
    
    // Parse as number
    const num = parseInt(numericValue, 10)
    
    // Format with thousand separators
    return new Intl.NumberFormat("id-ID").format(Math.abs(num))
  }, [])

  const parseValue = useCallback((formatted: string): string => {
    if (!formatted) return ""
    
    // Remove thousand separators
    const cleanValue = formatted.replace(/\./g, "")
    
    // Add IDR prefix for display purposes if it's a positive number
    if (cleanValue && !cleanValue.startsWith("-")) {
      return cleanValue
    }
    
    return cleanValue
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const parsedValue = parseValue(rawValue)
    
    setDisplayValue(formatCurrency(parsedValue))
    setInternalValue(parsedValue)
    
    onChange?.(parsedValue)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {id && id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')}
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">Rp</span>
        </div>
        <Input
          id={id}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pl-8 ${className}`}
          inputMode="numeric"
        />
      </div>
    </div>
  )
}