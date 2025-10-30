import { useGameStore } from '../gameStore'
import type { PlayerId } from '../../types/types'

/**
 * Hook para gestionar los turnos de los jugadores
 */
export const useTurnManagement = () => {
  const game = useGameStore((state) => state.game)

  /**
   * Obtiene el jugador actual del turno
   */
  const getCurrentPlayer = (): PlayerId | null => {
    return game.player_turn
  }

  /**
   * Verifica si es el turno de un jugador específico
   */
  const isPlayerTurn = (playerId: PlayerId): boolean => {
    return game.player_turn === playerId
  }

  /**
   * Avanza al siguiente turno (rotación circular)
   */
  const nextTurn = () => {
    useGameStore.setState((state) => {
      if (!state.game.player_turn) return state
      
      const currentIndex = state.game.active_players.indexOf(state.game.player_turn)
      const nextIndex = (currentIndex + 1) % state.game.active_players.length
      const nextPlayerId = state.game.active_players[nextIndex]
      
      return {
        game: {
          ...state.game,
          player_turn: nextPlayerId
        }
      }
    })
  }

  /**
   * Establece el turno a un jugador específico
   */
  const setTurn = (playerId: PlayerId) => {
    useGameStore.setState((state) => ({
      game: {
        ...state.game,
        player_turn: playerId
      }
    }))
  }

  /**
   * Obtiene el dueño de la llave (key_owner)
   */
  const getKeyOwner = (): PlayerId => {
    return game.key_owner
  }

  /**
   * Establece el dueño de la llave
   */
  const setKeyOwner = (playerId: PlayerId) => {
    useGameStore.setState((state) => ({
      game: {
        ...state.game,
        key_owner: playerId
      }
    }))
  }

  return {
    // Estado
    currentPlayer: game.player_turn,
    keyOwner: game.key_owner,
    activePlayers: game.active_players,
    
    // Métodos
    getCurrentPlayer,
    isPlayerTurn,
    nextTurn,
    setTurn,
    getKeyOwner,
    setKeyOwner
  }
}
