import { useEffect } from 'react'
import backgroundImage from '../../assets/ background.jpg'
import { PlayerBoard } from '../player/PlayerBoard'
import { useGameStore } from '../../store/gameStore'
import { CommonBoard } from '../common-board/CommonBoard'

export const Game = () => {
  const { player, deck, initializeDeck, dealCards } = useGameStore()

  // Inicializar el juego al montar el componente
  useEffect(() => {
    initializeDeck()
  }, [initializeDeck])

  // Repartir cartas después de mezclar
  useEffect(() => {
    if (deck.length > 0 && player.hand.length === 0) {
      dealCards(6)
    }
  }, [deck, player.hand.length, dealCards])

  return (
    <div 
      className="w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-cover bg-center bg-no-repeat relative before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:z-0 before:pointer-events-none"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <CommonBoard />
      <PlayerBoard player={player} />
    </div>
  )
}
