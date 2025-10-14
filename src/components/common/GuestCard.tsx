import React from 'react'
import { getImagePath } from '../../utils/utils'
import type { GuestCard as GuestType } from '../../types/types'

interface GuestProps {
  guest: GuestType
  height?: number
}

export const GuestCard: React.FC<GuestProps> = ({ 
  guest, 
  height = 200 
}) => {

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <img
        src={getImagePath('characters-cards', guest.image_url)}
        alt={guest.name}
        className="w-auto h-full object-contain rounded-sm"
      />
      
      {/* Total nights - top right corner */}
      <div className="absolute top-[1px] right-[1px] text-white text-xl px-2 rounded">
        {guest.total_nights}
      </div>
      
      {/* Guest name - bottom center with Victorian handwriting style */}
      <div 
        className="absolute bottom-[7px] left-0 right-0 font-light text-center text-grey text-sm px-2 py-2 opacity-80"
        style={{ 
          fontFamily: "'Balthazar', serif",
        }}
      >
        {guest.name}
      </div>
    </div>
  )
}
