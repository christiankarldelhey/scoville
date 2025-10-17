import React from 'react'
import { GuestCard } from '../../components/common/GuestCard'
import guestsData from '../../data/deck-characters.json'
import type { GuestCard as GuestType } from '../../types/types'

export const Guests = () => {
  const Guests = guestsData as GuestType[]

  return (
    <div className="flex justify-center items-center gap-4 w-[100%] pt-[15px] mx-auto">  
        <GuestCard guest={Guests[16]} height={230} />
        {/* <GuestCard guest={Guests[22]} height={230} /> */}
    </div>

  )
}
