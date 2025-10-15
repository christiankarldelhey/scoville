import React from 'react'
import { Guests } from './Guests'
import type { PlayingCard } from '../../types/types'

interface PlayerPlayArea {
  playerId: string
  cards: PlayingCard[]
}

interface PlayZoneProps {
  topPlayer?: PlayerPlayArea
  bottomPlayer?: PlayerPlayArea
  leftPlayer?: PlayerPlayArea
  rightPlayer?: PlayerPlayArea
}

export const PlayZone: React.FC<PlayZoneProps> = ({
  topPlayer,
  bottomPlayer,
  leftPlayer,
  rightPlayer
}) => {
  const renderPlayArea = (cards: PlayingCard[] = [], position: 'top' | 'bottom' | 'left' | 'right') => {
    const positionClasses = {
      top: 'absolute top-0 left-1/2 -translate-x-1/2 flex-row gap-2 min-h-[300px]',
      bottom: 'absolute bottom-0 left-1/2 -translate-x-1/2 flex-row gap-2 min-h-[300px]',
      left: 'absolute left-0 top-1/2 -translate-y-1/2 flex-col gap-2 min-w-[300px]',
      right: 'absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-2 min-w-[300px]'
    }

    return (
      <div className={`flex items-center justify-center ${positionClasses[position]}`}>
        <div className="flex gap-2 p-4 bg-black/10 rounded-lg border-2 border-dashed border-white/30">
          {cards.length === 0 ? (
            <div className="text-white/50 text-sm">Zona de juego</div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="w-16 h-24 bg-white/20 rounded border border-white/40">
                {/* Aquí puedes renderizar las cartas jugadas */}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-[60%] h-[80%] min-h-[600px] flex items-center justify-center">
      {/* Área de juego superior */}
      {renderPlayArea(topPlayer?.cards, 'top')}
      
      {/* Área de juego inferior */}
      {renderPlayArea(bottomPlayer?.cards, 'bottom')}
      
      {/* Área de juego izquierda */}
      {renderPlayArea(leftPlayer?.cards, 'left')}
      
      {/* Área de juego derecha */}
      {renderPlayArea(rightPlayer?.cards, 'right')}
      
      {/* Componente Guests en el centro */}
      <div className="z-10">
        <Guests />
      </div>
    </div>
  )
}
