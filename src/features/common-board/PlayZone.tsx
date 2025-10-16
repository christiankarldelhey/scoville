import React from 'react'
import { Guests } from './Guests'
import { PlayerDropZone } from './PlayerDropZone'
import type { PlayingCard } from '../../types/types'

interface PlayerPlayArea {
  playerId: string
  cards: PlayingCard[]
}

interface PlayZoneProps {
  topPlayer?: PlayerPlayArea
  bottomPlayer?: PlayerPlayArea
  leftPlayer?: PlayerPlayArea
  rightPlayer?: PlayerPlayArea
  onCardDrop?: (playerId: string, cardId: number) => void
}

export const PlayZone: React.FC<PlayZoneProps> = ({
  topPlayer,
  bottomPlayer,
  leftPlayer,
  rightPlayer,
  onCardDrop
}) => {
  return (
    <div className="relative w-[70%] h-[80%] min-h-[600px] flex items-center justify-center">
      <PlayerDropZone
        playerId={topPlayer?.playerId}
        cards={topPlayer?.cards || []}
        position="top"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={bottomPlayer?.playerId}
        cards={bottomPlayer?.cards || []}
        position="bottom"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={leftPlayer?.playerId}
        cards={leftPlayer?.cards || []}
        position="left"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={rightPlayer?.playerId}
        cards={rightPlayer?.cards || []}
        position="right"
        onCardDrop={onCardDrop}
      />
      
      <div className="z-10">
        <Guests />
      </div>
    </div>
  )
}
