import { useGameStore } from '../gameStore'
import type { PlayerId, GuestCard } from '../../types/types'

/**
 * Hook para las fases de puja por guests (guest_bid_1 y guest_bid_2)
 * Los jugadores pujan por guests jugando cartas en la mesa
 */
export const useGuestBids = () => {
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)

  /**
   * Inicia una puja por un guest
   * TODO: Implementar
   */
  const startGuestBid = (guestCard: GuestCard) => {
    console.log('startGuestBid - Por implementar', guestCard)
  }

  /**
   * Actualiza el bid actual (la carta guest por la que se puja)
   * TODO: Implementar - Puede usar updateBid de useCardManagement
   */
  const updateCurrentBid = (newBid: GuestCard[] | null) => {
    console.log('updateCurrentBid - Por implementar', newBid)
  }

  /**
   * Un jugador juega cartas en la mesa para pujar
   * TODO: Implementar - Puede usar playCard de useCardManagement
   */
  const playCardsForBid = (playerId: PlayerId, cardIds: number[]) => {
    console.log('playCardsForBid - Por implementar', playerId, cardIds)
  }

  /**
   * Resuelve la puja y asigna el guest al ganador
   * TODO: Implementar
   */
  const resolveGuestBid = () => {
    console.log('resolveGuestBid - Por implementar')
  }

  /**
   * Determina el ganador de la puja basándose en meld_score
   * TODO: Implementar
   */
  const determineWinner = (): PlayerId | null => {
    console.log('determineWinner - Por implementar')
    return null
  }

  return {
    // Estado
    currentBid: game.bid,
    tablePlays: game.table_plays,
    
    // Métodos
    startGuestBid,
    updateCurrentBid,
    playCardsForBid,
    resolveGuestBid,
    determineWinner
  }
}
