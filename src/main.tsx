import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Game } from './features/game/Game'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Game />  
  </StrictMode>,
)
