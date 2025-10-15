import { useEffect } from 'react'
import backgroundImage from '../../assets/ background.jpg'
import { PlayerBoard } from '../player/PlayerBoard'
import { useGameStore } from '../../store/gameStore'
import { CommonBoard } from '../common-board/CommonBoard'

export const Game = () => {
  const { game, players, initializeGame, dealCardsToAllPlayers } = useGameStore()
  
  // Nuestro jugador es player_1
  const myPlayer = players.player_1

  // Inicializar el juego al montar el componente
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Repartir cartas después de mezclar (solo si nadie tiene cartas aún)
  useEffect(() => {
    if (game.deck.length > 0 && myPlayer.hand.length === 0) {
      dealCardsToAllPlayers(6)
    }
  }, [game.deck.length, myPlayer.hand.length, dealCardsToAllPlayers])

  return (
    <div 
      className="w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-cover bg-center bg-no-repeat relative before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:z-0 before:pointer-events-none"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className="relative z-10 w-full h-full flex flex-col">
        <CommonBoard />
        <PlayerBoard player={myPlayer} />
      </div>
    </div>
  )
}
