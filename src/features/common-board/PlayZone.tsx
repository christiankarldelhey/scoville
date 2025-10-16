import React from 'react'
import { Guests } from './Guests'
import type { PlayingCard } from '../../types/types'
import { PlayingCard as PlayingCardComponent } from '../../components/common/PlayingCard'

interface PlayerPlayArea {
  playerId: string
  cards: PlayingCard[]
}

interface PlayZoneProps {
  topPlayer?: PlayerPlayArea
  bottomPlayer?: PlayerPlayArea
  leftPlayer?: PlayerPlayArea
  rightPlayer?: PlayerPlayArea
  onCardDrop?: (playerId: string, cardId: number) => void
}

export const PlayZone: React.FC<PlayZoneProps> = ({
  topPlayer,
  bottomPlayer,
  leftPlayer,
  rightPlayer,
  onCardDrop
}) => {
  const renderPlayArea = (playerArea: PlayerPlayArea | undefined, position: 'top' | 'bottom' | 'left' | 'right') => {
    const cards = playerArea?.cards || []
    const playerId = playerArea?.playerId
    
    const positionClasses = {
      top: 'absolute top-0 left-1/2 -translate-x-1/2 flex-row gap-2 min-h-[300px]',
      bottom: 'absolute bottom-0 left-1/2 -translate-x-1/2 flex-row gap-2 min-h-[300px]',
      left: 'absolute left-0 top-1/2 -translate-y-1/2 flex-col gap-2 min-w-[300px]',
      right: 'absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-2 min-w-[300px]'
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      const cardId = e.dataTransfer.getData('cardId')
      if (cardId && playerId && onCardDrop) {
        onCardDrop(playerId, parseInt(cardId))
      }
    }

    return (
      <div className={`flex items-center justify-center ${positionClasses[position]}`}>
        <div 
          className="flex gap-2 p-4 bg-black/10 rounded-lg border-2 border-dashed border-white/30 transition-colors hover:bg-black/20 hover:border-white/50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {cards.length === 0 ? (
            <div className="text-white/50 text-sm">Zona de juego</div>
          ) : (
            cards.map((card) => (
              <PlayingCardComponent
                key={card.id}
                card={card}
                height={100}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-[60%] h-[80%] min-h-[600px] flex items-center justify-center">
      {/* Área de juego superior */}
      {renderPlayArea(topPlayer, 'top')}
      
      {/* Área de juego inferior */}
      {renderPlayArea(bottomPlayer, 'bottom')}
      
      {/* Área de juego izquierda */}
      {renderPlayArea(leftPlayer, 'left')}
      
      {/* Área de juego derecha */}
      {renderPlayArea(rightPlayer, 'right')}
      
      {/* Componente Guests en el centro */}
      <div className="z-10">
        <Guests />
      </div>
    </div>
  )
}
