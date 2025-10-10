import React from 'react'
import { Dishes } from './Dishes'
import { OtherPlayerHand } from './OtherPlayerHand'
import styles from './CommonBoard.module.css'

export const CommonBoard = () => {
  
  return (
    <div className={styles.container}>
      <OtherPlayerHand cardCount={5} position="top" />
      <OtherPlayerHand cardCount={5} position="left" />
      <OtherPlayerHand cardCount={5} position="right" />
      <Dishes />
    </div>
  )
}
