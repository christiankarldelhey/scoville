import React from 'react'
import { getImagePath } from '../../utils/utils'
import type { RoomCard as RoomCardType } from '../../types/types'

interface RoomCardProps {
  card: RoomCardType
  height?: number
}

export const RoomCard: React.FC<RoomCardProps> = ({ 
  card, 
  height = 800 
}) => {


  return (
    <img
      src={getImagePath('room-cards', card.image_url)}
      alt={`${card.image_url}`}
      className="w-auto object-contain"
      style={{ height: `${height}px` }}
    />
  )
}