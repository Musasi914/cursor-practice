import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { applyThemeToDocument, readThemePreference } from './reading/lib/themeStorage'
import App from './App.tsx'

applyThemeToDocument(readThemePreference())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
