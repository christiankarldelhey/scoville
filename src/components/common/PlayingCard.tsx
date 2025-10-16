import React from 'react'
import { getImagePath } from '../../utils/utils'
import type { PlayingCard as PlayingCardType } from '../../types/types'

interface PlayingCardProps {
  card: PlayingCardType
  height?: number
  onClick?: () => void
  draggable?: boolean
  onDragStart?: (cardId: number) => void
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  height = 800,
  onClick,
  draggable = false,
  onDragStart
}) => {
  // Determinar si la carta debe estar elevada
  const isElevated = card.is_selected || card.has_coincidence !== null

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('cardId', card.id.toString())
    if (onDragStart) {
      onDragStart(card.id)
    }
  }

  return (
    <img
      src={getImagePath('cards-inn', card.image_url)}
      alt={`${card.product} ${card.suit}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      className={`w-auto object-contain rounded-sm transition-transform duration-300 ease-in-out ${
        isElevated ? '-translate-y-[8%]' : 'translate-y-0'
      } ${
        onClick ? 'cursor-pointer hover:brightness-110' : ''
      } ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      style={{ height: `${height}px` }}
      onClick={onClick}
    />
  )
}
