import React from 'react'
import { Guests } from './Guests'
import { PlayerDropZone } from './PlayerDropZone'
import type { PlayingCard, Initial } from '../../types/types'

interface PlayerPlayArea {
  playerId: string
  cards: PlayingCard[]
  allowedCards: Initial[]
  meldScore: number
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
    <div className="relative w-[80%] h-[80%] min-h-[600px] flex items-center justify-center">
      <PlayerDropZone
        playerId={topPlayer?.playerId}
        cards={topPlayer?.cards || []}
        allowedCards={topPlayer?.allowedCards}
        meldScore={topPlayer?.meldScore}
        position="top"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={bottomPlayer?.playerId}
        cards={bottomPlayer?.cards || []}
        allowedCards={bottomPlayer?.allowedCards}
        meldScore={bottomPlayer?.meldScore}
        position="bottom"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={leftPlayer?.playerId}
        cards={leftPlayer?.cards || []}
        allowedCards={leftPlayer?.allowedCards}
        meldScore={leftPlayer?.meldScore}
        position="left"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={rightPlayer?.playerId}
        cards={rightPlayer?.cards || []}
        allowedCards={rightPlayer?.allowedCards}
        meldScore={rightPlayer?.meldScore}
        position="right"
        onCardDrop={onCardDrop}
      />
      
      <div className="z-10">
        <Guests />
      </div>
    </div>
  )
}
