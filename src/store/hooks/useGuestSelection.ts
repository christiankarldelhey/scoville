import { useGameStore } from '../gameStore'
import type { PlayerId, GuestCard } from '../../types/types'

/**
 * Hook para la fase de selección de guests (guest_selection)
 * Los jugadores seleccionan guests del deck para asignar a sus habitaciones
 */
export const useGuestSelection = () => {
  const game = useGameStore((state) => state.game)

  /**
   * Limpia el bid y prepara 3 cartas de guest para la selección
   * Esta función se ejecuta al entrar a la fase guest_selection
   */
  const cleanBidAndPrepareGuestSelection = () => {
    useGameStore.setState((state) => {
      // Tomar 3 cartas random del guest_deck
      const shuffledDeck = [...state.game.guest_deck].sort(() => Math.random() - 0.5)
      const selectedGuests = shuffledDeck.slice(0, 3)
      const remainingDeck = shuffledDeck.slice(3)
      
      return {
        game: {
          ...state.game,
          bid: null, // Limpiar el bid
          guests_to_bid: selectedGuests, // Asignar las 3 cartas para selección
          guest_deck: remainingDeck // Actualizar el deck
        }
      }
    })
  }

  /**
   * Saca cartas de guests del deck para que los jugadores elijan
   */
  const drawGuestCards = (count: number) => {
    console.log('drawGuestCards - Por implementar', count)
  }

  /**
   * Un jugador selecciona un guest y lo añade a su mano
   */
  const selectGuest = (playerId: PlayerId, guestCard: GuestCard) => {
    useGameStore.setState((state) => {
      const player = state.players[playerId]
      
      return {
        players: {
          ...state.players,
          [playerId]: {
            ...player,
            hand: [...player.hand, guestCard]
          }
        }
      }
    })
    
    console.log('✅ Guest seleccionado y añadido a la mano de', playerId, ':', guestCard.name)
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
    guestsToBid: game.guests_to_bid,
    
    // Métodos
    cleanBidAndPrepareGuestSelection,
    drawGuestCards,
    selectGuest,
    assignGuestToRoom,
    allPlayersSelectedGuests
  }
}
