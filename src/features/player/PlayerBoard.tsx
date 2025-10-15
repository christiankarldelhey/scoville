import React, { useRef, useEffect } from 'react'
import type { Player } from '../../types/types'
import { PlayingCard } from '../../components/common/PlayingCard'
import { RoomCard } from '../../components/common/RoomCard'
import { useGameStore } from '../../store/gameStore'

interface PlayerBoardProps {
  player: Player
}

export const PlayerBoard: React.FC<PlayerBoardProps> = ({ 
  player,
}) => {
  const selectCard = useGameStore((state) => state.selectCard)
  const deselectCards = useGameStore((state) => state.deselectCards)
  const handRef = useRef<HTMLDivElement>(null)

  // Manejar click en una carta
  const handleCardClick = (cardId: number) => {
    selectCard(player.player_id, cardId)
  }

  // Manejar click fuera de las cartas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (handRef.current && !handRef.current.contains(event.target as Node)) {
        deselectCards(player.player_id)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [player.player_id, deselectCards])

  return (
    <div className="relative flex-1 w-full bg-transparent">
      <div className="flex flex-row gap-2 w-full h-full items-center justify-center">
        <div 
          ref={handRef}
          className="flex gap-2 p-4 overflow-x-auto items-center justify-center"
        >
          {player.hand.map((card) => (
            <PlayingCard 
              key={card.id} 
              card={card} 
              height={180}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
        {/* <div className="flex gap-0 p-4 overflow-x-auto items-center justify-center">
          {player.rooms?.map((room) => (
            <RoomCard 
              key={room.id} 
              card={room} 
              height={180} 
            />
          ))}
        </div> */}
      </div>
    </div>
  )
}
