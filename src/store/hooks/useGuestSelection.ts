import { useGameStore } from '../gameStore'
import type { PlayerId, GuestCard } from '../../types/types'

/**
 * Hook para la fase de selección de guests (guest_selection)
 * Los jugadores seleccionan guests del deck para asignar a sus habitaciones
 */
export const useGuestSelection = () => {
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)

  /**
   * Saca cartas de guests del deck para que los jugadores elijan
   * TODO: Implementar
   */
  const drawGuestCards = (count: number) => {
    console.log('drawGuestCards - Por implementar', count)
  }

  /**
   * Un jugador selecciona un guest
   * TODO: Implementar
   */
  const selectGuest = (playerId: PlayerId, guestCard: GuestCard) => {
    console.log('selectGuest - Por implementar', playerId, guestCard)
  }

  /**
   * Asigna un guest a una habitación específica del jugador
   * TODO: Implementar
   */
  const assignGuestToRoom = (playerId: PlayerId, guestCard: GuestCard, roomIndex: number) => {
    console.log('assignGuestToRoom - Por implementar', playerId, guestCard, roomIndex)
  }

  /**
   * Verifica si todos los jugadores han seleccionado sus guests
   * TODO: Implementar
   */
  const allPlayersSelectedGuests = (): boolean => {
    console.log('allPlayersSelectedGuests - Por implementar')
    return false
  }

  return {
    // Estado
    guestDeck: game.guest_deck,
    
    // Métodos
    drawGuestCards,
    selectGuest,
    assignGuestToRoom,
    allPlayersSelectedGuests
  }
}
