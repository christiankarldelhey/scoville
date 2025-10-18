import React from 'react'
import { GuestCard } from '../../components/common/GuestCard'
import { useGameStore } from '../../store/gameStore'

export const Guests = () => {
  const bid = useGameStore((state) => state.game.bid)

  return (
    <div className="flex justify-center items-center gap-4 w-[100%] pt-[15px] mx-auto">  
        {bid && bid.length > 0 && (
          <GuestCard guest={bid[0]} height={230} />
        )}
    </div>

  )
}
