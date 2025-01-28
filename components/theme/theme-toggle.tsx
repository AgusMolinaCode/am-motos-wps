'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

interface ThemeToggleProps {
  sunClassName?: string
  moonClassName?: string
}

export function ThemeToggle({ sunClassName, moonClassName }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      size='sm'
      variant={null}
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }}
      className='bg-transparent'
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className={`size-4 text-orange-300 ${sunClassName} bg-transparent`} />
      ) : (
        <MoonIcon className={`size-4  ${moonClassName} bg-transparent`} />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}