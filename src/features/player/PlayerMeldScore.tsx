import React from 'react'
import type { Initial, RoomCard } from '../../types/types'
import ScoreDisplay from '../../components/ui/ScoreDisplay'

interface PlayerMeldScoreProps {
  allowedCards: Initial[] | null
  meldScore: number
  roomCard: RoomCard | null
}

export const PlayerMeldScore: React.FC<PlayerMeldScoreProps> = ({
  allowedCards,
  meldScore,
  roomCard
}) => {
  return (
    <div className="flex flex-col items-center border border-[#3c424a] gap-3 h-[140px] w-[60px] bg-[#1c2a33] opacity-90 rounded-md py-2">

      {/* Room Card */}
      {roomCard && (
        <div className="flex h-12 flex-col grayscale items-center">
          <img
            src={`/src/assets/room-cards/${roomCard.image_nb_url}`}
            alt={`room-card-${roomCard.quality}`}
            className="object-cover w-[30px]"
          />
        </div>
      )}
      
      {/* Allowed Cards */}
      {allowedCards === null ? (
        <div className="flex flex-col items-center">
          <span className="text-white text-sm" style={{ fontFamily: 'Old Standard TT, serif' }}>
            *
          </span>
        </div>
      ) : allowedCards.length > 0 ? (
        <div className="flex flex-col items-center">
          <span className="text-white text-sm" style={{ fontFamily: 'Old Standard TT, serif' }}>
            {allowedCards.join(', ')}
          </span>
        </div>
      ) : null}
      
      {/* Meld Score */}
      <div className="flex-1 flex items-end justify-center pb-1">
        <ScoreDisplay score={meldScore} />
      </div>
    </div>
  )
}
