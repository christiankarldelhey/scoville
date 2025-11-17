import { useGameStore } from '../gameStore'
import type { RoundPhase } from '../../types/types'
import { ROUND_PHASE_ORDER } from '../../types/types'

/**
 * Hook orquestador principal del juego
 * Gestiona las transiciones entre fases de la ronda
 */
export const useGame = () => {
  const game = useGameStore((state) => state.game)

  /**
   * Obtiene la fase actual de la ronda
   */
  const getCurrentPhase = (): RoundPhase => {
    return game.roundPhase
  }

  /**
   * Obtiene el índice de la fase actual en el orden
   */
  const getCurrentPhaseIndex = (): number => {
    return ROUND_PHASE_ORDER.indexOf(game.roundPhase)
  }

  /**
   * Verifica si es la última fase de la ronda
   */
  const isLastPhase = (): boolean => {
    return getCurrentPhaseIndex() === ROUND_PHASE_ORDER.length - 1
  }

  /**
   * Avanza a la siguiente fase de la ronda
   * Si es la última fase, avanza al checkout de la siguiente ronda
   */
  const nextPhase = () => {
    useGameStore.setState((state) => {
      const currentIndex = getCurrentPhaseIndex()
      
      if (isLastPhase()) {
        // Si es la última fase, volver a checkout (nueva ronda)
        return {
          game: {
            ...state.game,
            roundPhase: 'checkout'
          }
        }
      }
      
      // Avanzar a la siguiente fase
      const nextPhase = ROUND_PHASE_ORDER[currentIndex + 1]
      
      // Si la siguiente fase es room_bid, limpiar las room_card de todos los table_plays
      let updatedTablePlays = state.game.table_plays
      if (nextPhase === 'room_bid') {
        console.log('🧹 Limpiando room_cards antes de entrar a room_bid')
        console.log('Table plays antes:', state.game.table_plays)
        updatedTablePlays = Object.fromEntries(
          Object.entries(state.game.table_plays).map(([playerId, tablePlay]) => [
            playerId,
            tablePlay ? { ...tablePlay, room_card: null } : null
          ])
        ) as typeof state.game.table_plays
        console.log('Table plays después:', updatedTablePlays)
      }
      
      return {
        game: {
          ...state.game,
          roundPhase: nextPhase,
          table_plays: updatedTablePlays
        }
      }
    })
  }

  /**
   * Establece una fase específica manualmente
   */
  const setPhase = (phase: RoundPhase) => {
    useGameStore.setState((state) => ({
      game: {
        ...state.game,
        roundPhase: phase
      }
    }))
  }

  /**
   * Verifica si todos los jugadores están listos para avanzar
   */
  const allPlayersReady = (): boolean => {
    return Object.values(game.players_ready).every(ready => ready === true)
  }

  /**
   * Marca un jugador como listo
   */
  const setPlayerReady = (playerId: string, ready: boolean) => {
    useGameStore.setState((state) => ({
      game: {
        ...state.game,
        players_ready: {
          ...state.game.players_ready,
          [playerId]: ready
        }
      }
    }))
  }

  /**
   * Resetea el estado de "ready" de todos los jugadores
   */
  const resetPlayersReady = () => {
    useGameStore.setState((state) => ({
      game: {
        ...state.game,
        players_ready: {
          player_1: false,
          player_2: false,
          player_3: false,
          player_4: false
        }
      }
    }))
  }

  return {
    // Estado
    currentPhase: game.roundPhase,
    currentRound: game.round,
    playersReady: game.players_ready,
    
    // Métodos de fase
    getCurrentPhase,
    getCurrentPhaseIndex,
    isLastPhase,
    nextPhase,
    setPhase,
    
    // Métodos de jugadores listos
    allPlayersReady,
    setPlayerReady,
    resetPlayersReady
  }
}
