import React from 'react'
import { getImagePath } from '../../utils/utils'
import type { PlayingCard as PlayingCardType } from '../../types/types'

interface PlayingCardProps {
  card: PlayingCardType
  height?: number
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  height = 800 
}) => {


  return (
    <img
      src={getImagePath('cards-inn', card.image_url)}
      alt={`${card.value} ${card.suit}`}
      className="w-auto object-contain"
      style={{ height: `${height}px` }}
    />
  )
}
