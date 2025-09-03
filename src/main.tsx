import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import OneTalePage from './OneTalePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/words_made_of_pixels">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tale/:slug" element={<OneTalePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
