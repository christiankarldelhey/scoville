import React from 'react'
import { getImagePath } from '../../utils/utils'
import type { PlayingCard as PlayingCardType } from '../../types/types'

interface PlayingCardProps {
  card: PlayingCardType
  height?: number
  onClick?: () => void
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  height = 800,
  onClick
}) => {
  // Determinar si la carta debe estar elevada
  const isElevated = card.is_selected || card.has_coincidence !== null

  return (
    <img
      src={getImagePath('cards-inn', card.image_url)}
      alt={`${card.product} ${card.suit}`}
      className={`w-auto object-contain rounded-sm transition-transform duration-300 ease-in-out ${
        isElevated ? '-translate-y-[8%]' : 'translate-y-0'
      } ${
        onClick ? 'cursor-pointer hover:brightness-110' : ''
      }`}
      style={{ height: `${height}px` }}
      onClick={onClick}
    />
  )
}
