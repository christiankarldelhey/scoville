import React from 'react'
import { getImagePath } from '../../utils/utils'
import { EventMarker } from '../ui/EventMarker'
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
    <div className="relative inline-block overflow-hidden">
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

      {card.suit !== 'discount' && 
      <div>
        {/* El de mas a la izquierda picudo */}
        <EventMarker 
          text={card.second_row}
          position="7%"
          offsetY="-38%"
          textOffsetY="50%"
          rotation={88}
          color="#9a9b9e"
          size={40}
        />
        {/* El de mas a la derecha redondo */}
        <EventMarker 
        text={card.first_row}
        position="40%"
        offsetY="-40%"
        textOffsetY="50%"
        rotation={-92}
        color="#575758"
        size={40}
        />
      </div>
      
    }  
    </div>
  )
}
