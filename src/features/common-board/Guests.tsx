import React from 'react'
import { GuestCard } from '../../components/common/GuestCard'
import guestsData from '../../data/deck-characters.json'
import type { GuestCard as GuestType } from '../../types/types'

export const Guests = () => {
  const Guests = guestsData as GuestType[]

  return (
    <div className="flex justify-center items-center gap-4 w-[55%] pt-[50px] mx-auto">  
        <GuestCard guest={Guests[10]} height={230} />
        <GuestCard guest={Guests[28]} height={230} />
    </div>

  )
}
