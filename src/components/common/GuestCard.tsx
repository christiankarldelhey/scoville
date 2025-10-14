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
    <img
      src={getImagePath('characters-cards', guest.image_url)}
      alt={guest.name}
      className="w-auto object-contain rounded-sm"
      style={{ height: `${height}px` }}
    />
  )
}
