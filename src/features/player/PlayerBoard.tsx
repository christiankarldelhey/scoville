import React from 'react'
import type { Player } from '../../types/types'
import { PlayingCard } from '../../components/common/PlayingCard'
import styles from './PlayerBoard.module.css'

interface PlayerBoardProps {
  player: Player
  maxCards?: number
}

export const PlayerBoard: React.FC<PlayerBoardProps> = ({ 
  player,
  maxCards = 10 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.cardsContainer}>
        {player.hand.map((card) => (
          <PlayingCard 
            key={card.id} 
            card={card} 
            height={200} 
          />
        ))}
      </div>
    </div>
  )
}
