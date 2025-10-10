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
      src={getImagePath('cards', card.image_url)}
      alt={`${card.value} ${card.suit}`}
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain'
      }}
    />
  )
}
