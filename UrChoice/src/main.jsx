import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Preloader from '../src/Pages/Preloader/Preloader'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preloader />
  </StrictMode>,
)
