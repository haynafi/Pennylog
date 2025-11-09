"use client"

import { useState, useEffect, useRef } from "react"

export function useCookieStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    const getCookie = (name: string): string | null => {
      const nameEQ = name + "="
      const cookies = document.cookie.split(";")
      for (let cookie of cookies) {
        cookie = cookie.trim()
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length))
        }
      }
      return null
    }

    const value = getCookie(key)
    if (value) {
      try {
        setStoredValue(JSON.parse(value))
      } catch {
        setStoredValue(initialValue)
      }
    }
  }, [key, initialValue])

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)

    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `${key}=${encodeURIComponent(
      JSON.stringify(valueToStore),
    )};expires=${expires.toUTCString()};path=/`
  }

  return [storedValue, setValue] as const
}
