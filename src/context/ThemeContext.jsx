import { useEffect, useState } from 'react'
import { ThemeContext } from './themeContextObject'
import { THEMES } from './themes'

const STORAGE_KEY = 'meetler-theme'
const THEME_IDS = THEMES.map((t) => t.id)

function getInitialTheme() {
  if (typeof window === 'undefined') return 'default'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return THEME_IDS.includes(stored) ? stored : 'default'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (next) => {
    if (THEME_IDS.includes(next)) setThemeState(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
