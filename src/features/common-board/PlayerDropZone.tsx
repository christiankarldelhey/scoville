import React from 'react'
import type { PlayingCard } from '../../types/types'
import { PlayingCard as PlayingCardComponent } from '../../components/common/PlayingCard'

interface PlayerDropZoneProps {
  playerId?: string
  cards: PlayingCard[]
  position: 'top' | 'bottom' | 'left' | 'right'
  onCardDrop?: (playerId: string, cardId: number) => void
}

export const PlayerDropZone: React.FC<PlayerDropZoneProps> = ({
  playerId,
  cards,
  position,
  onCardDrop
}) => {
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

  const positionStyles = {
    top: 'absolute top-4 left-1/2 -translate-x-1/2',
    bottom: 'absolute bottom-4 left-1/2 -translate-x-1/2',
    left: 'absolute left-0 top-1/2 -translate-y-1/2',
    right: 'absolute right-0 top-1/2 -translate-y-1/2'
  }

  const isHorizontalSide = position === 'left' || position === 'right'
  const dropZoneClasses = isHorizontalSide
    ? 'w-[650px] h-[150px]'
    : 'w-[500px] h-[150px]'

  return (
    <div className={positionStyles[position]}>
      <div
        className={`${dropZoneClasses} flex items-center justify-center gap-3 p-6 bg-black/10 rounded-lg  transition-colors`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {cards.length === 0 ? (
          <div></div>
        ) : (
          <div className="flex gap-2">
            {cards.map((card) => (
              <PlayingCardComponent
                key={card.id}
                card={card}
                height={140}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
