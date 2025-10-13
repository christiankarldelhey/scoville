import React from 'react'
import type { Player } from '../../types/types'
import { PlayingCard } from '../../components/common/PlayingCard'
import { RoomCard } from '../../components/common/RoomCard'

interface PlayerBoardProps {
  player: Player
}

export const PlayerBoard: React.FC<PlayerBoardProps> = ({ 
  player,
}) => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/4 bg-transparent z-10">
      <div className="flex flex-row gap-2 w-full items-center justify-center">
        <div className="flex gap-2 p-4 overflow-x-auto items-center justify-center">
          {player.hand.map((card) => (
            <PlayingCard 
              key={card.id} 
              card={card} 
              height={180} 
            />
          ))}
        </div>
        <div className="flex gap-0 p-4 overflow-x-auto items-center justify-center">
          {player.rooms?.map((room) => (
            <RoomCard 
              key={room.id} 
              card={room} 
              height={180} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}
