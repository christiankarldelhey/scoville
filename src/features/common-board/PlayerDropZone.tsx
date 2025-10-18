import React from 'react'
import type { PlayingCard, Initial } from '../../types/types'
import { PlayingCard as PlayingCardComponent } from '../../components/common/PlayingCard'

interface PlayerDropZoneProps {
  playerId?: string
  cards: PlayingCard[]
  position: 'top' | 'bottom' | 'left' | 'right'
  onCardDrop?: (playerId: string, cardId: number) => void
  allowedCards?: Initial[]
  meldScore?: number
}

export const PlayerDropZone: React.FC<PlayerDropZoneProps> = ({
  playerId,
  cards,
  position,
  onCardDrop,
  allowedCards = [],
  meldScore = 0
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

  const hasPlayedCards = cards.length > 0

  return (
    <div className={positionStyles[position]}>
      <div
        className={`${dropZoneClasses} flex items-center justify-center gap-3 p-6 bg-black/10 rounded-lg transition-colors`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Sidebar izquierdo con allowed cards y meld score */}
        {hasPlayedCards && (
          <div className="flex flex-col items-center justify-between h-full py-2 px-3 bg-black/20 rounded-md min-w-[60px]">
            {/* Allowed Cards */}
            <div className="flex flex-col gap-2 items-center">
              <div className="flex flex-col gap-1">
                {allowedCards.map((initial) => (
                  <div
                    key={initial}
                    className="w-8 h-8 bg-blue-500/80 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white font-bold text-sm">{initial}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Meld Score */}
            <div className="flex flex-col gap-1 items-center">
              <div className="w-10 h-10 bg-amber-500/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{meldScore}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cards area */}
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
