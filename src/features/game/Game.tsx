import { useEffect } from 'react'
import backgroundImage from '../../assets/ background.jpg'
import { PlayerBoard } from '../player/PlayerBoard'
import { useGameStore } from '../../store/gameStore'
import { CommonBoard } from '../common-board/CommonBoard'
import styles from './Game.module.css'

export const Game = () => {
  const { player, deck, initializeDeck, dealCards } = useGameStore()

  // Inicializar el juego al montar el componente
  useEffect(() => {
    initializeDeck()
  }, [initializeDeck])

  // Repartir cartas después de mezclar
  useEffect(() => {
    if (deck.length > 0 && player.hand.length === 0) {
      dealCards(5)
    }
  }, [deck, player.hand.length, dealCards])

  return (
    <div 
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <CommonBoard />
      <PlayerBoard player={player} />
    </div>
  )
}
