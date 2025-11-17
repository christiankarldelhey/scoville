import React from 'react'
import type { PlayingCard, Initial, RoomCard } from '../../types/types'
import { PlayingCard as PlayingCardComponent } from '../../components/common/PlayingCard'
import { PlayerMeldScore } from '../player/PlayerMeldScore'

interface PlayerDropZoneProps {
  playerId?: string
  cards: PlayingCard[]
  position: 'top' | 'bottom' | 'left' | 'right'
  onCardDrop?: (playerId: string, cardId: number) => void
  allowedCards?: Initial[] | null
  meldScore?: number
  roomCard?: RoomCard | null
}

export const PlayerDropZone: React.FC<PlayerDropZoneProps> = ({
  playerId,
  cards,
  position,
  onCardDrop,
  allowedCards = null,
  meldScore = 0,
  roomCard = null
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

  // Mostrar PlayerMeldScore si hay cartas jugadas O si hay una room_card seleccionada
  const shouldShowMeldScore = cards.length > 0 || roomCard !== null

  return (
    <div className={positionStyles[position]}>
      <div
        className={`${dropZoneClasses} flex items-center justify-center gap-3 p-6 bg-black/10 rounded-lg transition-colors`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Sidebar izquierdo con allowed cards y meld score */}
        {shouldShowMeldScore && (
          <PlayerMeldScore 
            allowedCards={allowedCards} 
            meldScore={meldScore} 
            roomCard={roomCard}
          />
        )}

        {/* Cards area */}
        {cards.length === 0 ? (
          <div></div>
        ) : (
          <div className="flex gap-2">
            {cards.map((card, index) => (
              <PlayingCardComponent
                key={card.id}
                card={card}
                height={140}
                style={cards.length && position !== 'bottom' ? {
                  transform: `translateX(-${index * 78}%)`,
                  zIndex: index
                } : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
