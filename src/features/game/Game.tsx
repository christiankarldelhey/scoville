import { useEffect, useState } from 'react'
import backgroundImage from '../../assets/ background.jpg'
import { PlayerBoard } from '../player/PlayerBoard'
import { useGameStore } from '../../store/gameStore'
import { useGamePreparation } from '../../store/hooks/useGamePreparation'
import { useGame } from '../../store/hooks/useGame'
import { useCheckoutAndDeal } from '../../store/hooks/useCheckoutAndDeal'
import { PointsAssignmentModal } from '../../components/modals/PointsAssignmentModal'
import { CommonBoard } from '../common-board/CommonBoard'

export const Game = () => {
  // Estado del juego (solo lectura)
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)
  
  // Acciones a través de los hooks
  const { initializeGame, dealCardsToAllPlayers } = useGamePreparation()
  const { nextPhase, currentPhase, allPlayersReady, resetPlayersReady } = useGame()
  const { executeCheckout, getPointsToAssign } = useCheckoutAndDeal()
  
  // Estado para controlar el modal
  const [showPointsModal, setShowPointsModal] = useState(false)
  const [checkoutExecuted, setCheckoutExecuted] = useState(false)
  
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

  // Avanzar a checkout después de repartir cartas
  useEffect(() => {
    if (currentPhase === 'game_preparation' && currentPlayer.hand.length > 0) {
      console.log('✅ Preparación completa, avanzando a checkout...')
      nextPhase()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase, currentPlayer.hand.length])

  // Ejecutar checkout cuando entramos a la fase checkout
  useEffect(() => {
    if (currentPhase === 'checkout' && !checkoutExecuted) {
      console.log('🏨 Entrando a fase checkout, ejecutando...')
      executeCheckout()
      setCheckoutExecuted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase, checkoutExecuted])

  // Abrir modal para el jugador actual si tiene puntos que asignar
  useEffect(() => {
    if (currentPhase === 'checkout' && checkoutExecuted) {
      const pointsToAssign = game.points_to_assign[currentPlayer.player_id]
      const isPlayerReady = game.players_ready[currentPlayer.player_id]
      
      console.log('💰 Puntos para', currentPlayer.player_id, ':', pointsToAssign, '| Listo:', isPlayerReady)
      
      // Abrir modal si tiene puntos y aún no está listo
      if (pointsToAssign > 0 && !isPlayerReady && !showPointsModal) {
        console.log('✅ Abriendo modal para', currentPlayer.player_id)
        setShowPointsModal(true)
      }
      
      // Si no tiene puntos, marcarlo como listo automáticamente
      if (pointsToAssign === 0 && !isPlayerReady) {
        console.log('⏭️', currentPlayer.player_id, 'no tiene puntos, marcando como listo')
        useGameStore.setState((state) => ({
          game: {
            ...state.game,
            players_ready: {
              ...state.game.players_ready,
              [currentPlayer.player_id]: true
            }
          }
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase, checkoutExecuted, game.points_to_assign, game.players_ready, currentPlayer.player_id])

  // Verificar si todos están listos y avanzar a la siguiente fase
  useEffect(() => {
    if (currentPhase === 'checkout' && checkoutExecuted && allPlayersReady()) {
      console.log('🎉 Todos los jugadores han asignado sus puntos!')
      console.log('🚀 Avanzando a guest_selection...')
      
      // Resetear players_ready para la siguiente fase
      resetPlayersReady()
      
      // Avanzar a la siguiente fase
      nextPhase()
      
      // Resetear el flag de checkout para la próxima ronda
      setCheckoutExecuted(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase, checkoutExecuted, game.players_ready])

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
      
      {/* Modal de asignación de puntos */}
      {showPointsModal && (
        <PointsAssignmentModal
          playerId={currentPlayer.player_id}
          totalPoints={getPointsToAssign(currentPlayer.player_id)}
          onClose={() => setShowPointsModal(false)}
        />
      )}
    </div>
  )
}
