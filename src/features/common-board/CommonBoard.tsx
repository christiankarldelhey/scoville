import React from 'react'
import { Guests } from './Guests'
import { OtherPlayerHand } from './OtherPlayerHand'
import styles from './CommonBoard.module.css'

export const CommonBoard = () => {
  
  return (
    <div className={styles.container}>
      <OtherPlayerHand cardCount={6} position="top" />
      <OtherPlayerHand cardCount={6} position="left" />
      <OtherPlayerHand cardCount={6} position="right" />
      <Guests />
    </div>
  )
}
