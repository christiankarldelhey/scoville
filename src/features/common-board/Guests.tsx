import React from 'react'
import { GuestCard } from '../../components/common/GuestCard'
import guestsData from '../../data/deck-characters.json'
import type { GuestCard as GuestType } from '../../types/types'

export const Guests = () => {
  const Guests = guestsData as GuestType[]

  return (
    <div className="flex justify-center items-center gap-4 w-[100%] pt-[15px] mx-auto">  
        <GuestCard guest={Guests[7]} height={230} />
        {/* <GuestCard guest={Guests[23]} height={150} /> */}
    </div>

  )
}
