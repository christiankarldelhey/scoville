import { useGameStore } from '../gameStore'
import type { PlayerId, Event } from '../../types/types'

/**
 * Hook para la fase de puntuación (scoring)
 * Calcula y asigna puntuaciones finales de la ronda
 */
export const useScoring = () => {
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)

  /**
   * Calcula la puntuación final de un jugador en la ronda
   * TODO: Implementar
   */
  const calculateFinalScore = (playerId: PlayerId): number => {
    console.log('calculateFinalScore - Por implementar', playerId)
    return 0
  }

  /**
   * Puntúa un evento completado por un jugador
   * TODO: Implementar
   */
  const scoreEvent = (playerId: PlayerId, event: Event) => {
    console.log('scoreEvent - Por implementar', playerId, event)
  }

  /**
   * Puntúa el objetivo secreto de un jugador
   * TODO: Implementar
   */
  const scoreSecretObjective = (playerId: PlayerId) => {
    console.log('scoreSecretObjective - Por implementar', playerId)
  }

  /**
   * Determina el ganador de la ronda
   * TODO: Implementar
   */
  const determineRoundWinner = (): PlayerId | null => {
    console.log('determineRoundWinner - Por implementar')
    return null
  }

  /**
   * Determina el ganador del juego (después de todas las rondas)
   * TODO: Implementar
   */
  const determineGameWinner = (): PlayerId | null => {
    console.log('determineGameWinner - Por implementar')
    return null
  }

  /**
   * Obtiene el ranking de jugadores por puntuación
   * TODO: Implementar
   */
  const getPlayerRanking = (): PlayerId[] => {
    console.log('getPlayerRanking - Por implementar')
    return []
  }

  return {
    // Estado
    playerScores: Object.fromEntries(
      Object.entries(players).map(([id, player]) => [id, player.score.score])
    ),
    
    // Métodos
    calculateFinalScore,
    scoreEvent,
    scoreSecretObjective,
    determineRoundWinner,
    determineGameWinner,
    getPlayerRanking
  }
}
