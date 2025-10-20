import React from 'react'
import type { Player } from '../../types/types'

interface PlayerControlsProps {
  player: Player
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  player,
}) => {
  return (
    <div className="flex flex-col gap-4 h-[200px] justify-center">
      <button className="bg-[#f5f5f0] hover:bg-[#eeeee8] text-[#2c2c2c] font-['Old_Standard_TT'] text-lg font-semibold rounded-md px-8 py-3 transition-colors border border-[#3c3c3c]/60 shadow-md">
        Aceptar
      </button>
      <button className="bg-[#f5f5f0] hover:bg-[#eeeee8] text-[#2c2c2c] font-['Old_Standard_TT'] text-lg font-semibold rounded-md px-8 py-3 transition-colors border border-[#3c3c3c]/60 shadow-md">
        Pasar
      </button>
    </div>
  )
}

export default PlayerControls