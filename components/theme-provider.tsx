"use client"

import type * as React from "react"

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <>{children}</>
  )
}

export const useTheme = () => {
  return {
    theme: 'light',
    setTheme: () => console.warn('not implemented')
  }
}
