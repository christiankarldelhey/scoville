import { useEffect } from 'react'
import backgroundImage from '../../assets/ background.jpg'
import { PlayerBoard } from '../player/PlayerBoard'
import { useGameStore } from '../../store/gameStore'
import { useGamePreparation } from '../../store/hooks/useGamePreparation'
import { CommonBoard } from '../common-board/CommonBoard'

export const Game = () => {
  // Estado del juego (solo lectura)
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)
  
  // Acciones a través del hook de preparación
  const { initializeGame, dealCardsToAllPlayers } = useGamePreparation()
  
  // El jugador actual es el que tiene el turno
  const currentPlayer = game.player_turn ? players[game.player_turn] : players.player_1

  // Inicializar el juego al montar el componente (solo una vez)
  useEffect(() => {
    initializeGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Repartir cartas después de mezclar (solo si nadie tiene cartas aún)
  useEffect(() => {
    if (game.deck.length > 0 && currentPlayer.hand.length === 0) {
      dealCardsToAllPlayers(6)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.deck.length, currentPlayer.hand.length])

  return (
    <div 
      className="w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-cover bg-center bg-no-repeat relative before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:z-0 before:pointer-events-none"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className="relative z-10 w-full h-full flex flex-col">
        <CommonBoard />
        <PlayerBoard player={currentPlayer} />
      </div>
    </div>
  )
}
