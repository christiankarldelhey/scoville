import React from 'react'
import type { Player } from '../../types/types'
import { useGameStore } from '../../store/gameStore'
import playBtnImg from '../../assets/game-controls/play_btn.png'
import passBtnImg from '../../assets/game-controls/pass_btn.png'

interface PlayerControlsProps {
  player: Player
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  player,
}) => {
  const nextTurn = useGameStore((state) => state.nextTurn)

  const handleButtonClick = () => {
    nextTurn()
  }

  return (
    <div className="flex flex-col gap-4 h-[200px] justify-center">
      <button 
        onClick={handleButtonClick}
        className="w-[90px] h-[90px] transition-all grayscale hover:grayscale-0"
      >
        <img src={playBtnImg} alt="Aceptar" className="w-full h-full object-contain rounded-md" />
      </button>
      <button 
        onClick={handleButtonClick}
        className="w-[90px] h-[90px] transition-all grayscale hover:grayscale-0 rounded-md"
      >
        <img src={passBtnImg} alt="Pasar" className="w-full h-full object-contain rounded-md" />
      </button>
    </div>
  )
}

export default PlayerControls