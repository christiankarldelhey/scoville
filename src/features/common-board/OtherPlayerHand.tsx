import React from 'react'
import styles from './OtherPlayerHand.module.css'
import cardBack from '../../assets/cards/card_back.png'

interface OtherPlayerHandProps {
  cardCount: number
  position: 'top' | 'left' | 'right'
}

export const OtherPlayerHand: React.FC<OtherPlayerHandProps> = ({ cardCount, position }) => {
  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <img
          key={index}
          src={cardBack}
          alt="card back"
          className={`${styles.card} ${styles[`card_${position}`]}`}
        />
      ))}
    </div>
  )
}
