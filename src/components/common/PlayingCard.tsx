import React from 'react'
import { getImagePath } from '../../utils/utils'
import { EventMarker } from '../ui/EventMarker'
import type { PlayingCard as PlayingCardType } from '../../types/types'

interface PlayingCardProps {
  card: PlayingCardType
  height?: number
  onClick?: () => void
  onMarkerClick?: (cardId: number, initial: string) => void
  draggable?: boolean
  onDragStart?: (cardId: number) => void
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  height = 800,
  onClick,
  onMarkerClick,
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

  const isMarkerSelected = (initial: string) => {
    return card.has_coincidence?.some((coincidence) => coincidence === initial)
  }

  const handleMarkerClick = (initial: string) => {
    if (onMarkerClick) {
      onMarkerClick(card.id, initial)
    }
  }



  return (
    <div className="relative inline-block">
      {/* Wrapper que aplica el movimiento de elevación a todo el contenido */}
      <div className={`transition-transform duration-300 ease-in-out ${
        isElevated ? '-translate-y-[8%]' : 'translate-y-0'
      }`}>
        {/* Wrapper con overflow-hidden para ocultar las partes del SVG fuera de la carta */}
        <div className="relative overflow-hidden rounded-md inline-block">
          <img
            src={getImagePath('cards-inn', card.image_url)}
            alt={`${card.product} ${card.suit}`}
            draggable={draggable}
            onDragStart={handleDragStart}
            className={`w-auto object-contain rounded-md opacity-90 ${
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
              onClick={() => handleMarkerClick(card.second_row)}
              text={card.second_row}
              position="7%"
              offsetY="-38%"
              textOffsetY="50%"
              rotation={88}
              color={isMarkerSelected(card.second_row) ? "red" : "#9a9b9e"}
              size={40}
            />
            {/* El de mas a la derecha redondo */}
            <EventMarker 
              onClick={() => handleMarkerClick(card.first_row)}
              text={card.first_row}
              position="40%"
              offsetY="-40%"
              textOffsetY="50%"
              rotation={-92}
              color={isMarkerSelected(card.first_row) ? "red" : "#575758"}
              size={40}
            />
          </div>
          
        }  
        </div>
      </div>
    </div>
  )
}
