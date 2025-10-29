import React from 'react'
import type { Initial } from '../../types/types'
import ScoreDisplay from '../../components/ui/ScoreDisplay'

interface PlayerMeldScoreProps {
  allowedCards: Initial[] | null
  meldScore: number
}

export const PlayerMeldScore: React.FC<PlayerMeldScoreProps> = ({
  allowedCards,
  meldScore
}) => {
  return (
    <div className="flex flex-col items-center gap-3 h-[140px] w-[60px] bg-[#262d37] opacity-80 rounded-md py-2">

      {/* Room Card */}
        <div className="flex h-12 flex-col grayscale items-center">
          <img
            src={`/src/assets/room-cards/1_no_bg.png`}
            alt={"room-card"}
            className="object-cover w-[30px]"
          />
        </div>
      
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
