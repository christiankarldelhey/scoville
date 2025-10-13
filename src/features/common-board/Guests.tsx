import React from 'react'
import { GuestCard } from '../../components/common/GuestCard'
import guestsData from '../../data/deck-characters.json'
import type { GuestCard as GuestType } from '../../types/types'
import styles from './Guests.module.css'

export const Guests = () => {
  const Guests = guestsData as GuestType[]

  return (
    <div className={styles.container}>  
        <GuestCard guest={Guests[9]} height={230} />
        <GuestCard guest={Guests[18]} height={230} />
    </div>

  )
}
