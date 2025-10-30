import { useGameStore } from './gameStore'
import type { PlayerId } from '../types/types'

/**
 * Hook para manejar la fase de Checkout y Deal de cada ronda
 */
export const useCheckoutAndDeal = () => {
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)

  /**
   * Calcula cuántos puntos recibe cada jugador por sus guests
   * 1 punto por cada guest que tenga en sus rooms
   */
  const calculatePointsFromGuests = (playerId: PlayerId): number => {
    const player = players[playerId]
    const guestsCount = player.rooms.filter(room => room.guest !== null).length
    return guestsCount
  }

  /**
   * Calcula cuántas habitaciones vacías tiene un jugador
   */
  const calculateEmptyRooms = (playerId: PlayerId): number => {
    const player = players[playerId]
    return player.rooms.filter(room => room.guest === null).length
  }

  /**
   * Ejecuta la fase de Checkout:
   * - Incrementa el round
   * - Calcula points_to_assign para cada jugador (1 por guest)
   * - Calcula cards_to_deal base (1 por habitación vacía)
   * - Incrementa used_nights de cada guest
   * - Mueve guests completados a former_guests
   */
  const executeCheckout = () => {
    useGameStore.setState((state) => {
      const updatedPlayers = { ...state.players }
      const pointsToAssign: Record<PlayerId, number> = {
        player_1: 0,
        player_2: 0,
        player_3: 0,
        player_4: 0
      }
      const cardsToDeal: Record<PlayerId, number> = {
        player_1: 0,
        player_2: 0,
        player_3: 0,
        player_4: 0
      }

      // Procesar cada jugador
      state.game.active_players.forEach((playerId) => {
        const player = updatedPlayers[playerId]
        
        // Calcular puntos por guests
        pointsToAssign[playerId] = calculatePointsFromGuests(playerId)
        
        // Calcular cartas base por habitaciones vacías
        cardsToDeal[playerId] = calculateEmptyRooms(playerId)
        
        // Procesar guests: incrementar used_nights y mover a former_guests si corresponde
        const updatedRooms = player.rooms.map(room => {
          if (!room.guest) return room
          
          const guest = room.guest
          const newUsedNights = guest.used_nights + 1
          
          // Si el guest completó sus noches, moverlo a former_guests
          if (newUsedNights >= guest.total_nights) {
            // Agregar guest a former_guests del score
            updatedPlayers[playerId] = {
              ...updatedPlayers[playerId],
              score: {
                ...updatedPlayers[playerId].score,
                former_guests: [
                  ...updatedPlayers[playerId].score.former_guests,
                  { ...guest, used_nights: newUsedNights }
                ]
              }
            }
            
            // Remover guest de la room
            return {
              ...room,
              guest: null
            }
          }
          
          // Incrementar used_nights del guest
          return {
            ...room,
            guest: {
              ...guest,
              used_nights: newUsedNights
            }
          }
        })
        
        updatedPlayers[playerId] = {
          ...updatedPlayers[playerId],
          rooms: updatedRooms
        }
      })

      return {
        game: {
          ...state.game,
          round: state.game.round + 1,
          points_to_assign: pointsToAssign,
          cards_to_deal: cardsToDeal
        },
        players: updatedPlayers
      }
    })
  }

  /**
   * Asigna los puntos de un jugador entre score y cartas adicionales
   * @param playerId - ID del jugador
   * @param pointsToScore - Puntos que van al score
   * @param pointsToCards - Puntos que se convierten en cartas adicionales
   */
  const assignPoints = (playerId: PlayerId, pointsToScore: number, pointsToCards: number) => {
    useGameStore.setState((state) => {
      const totalPoints = pointsToScore + pointsToCards
      const availablePoints = state.game.points_to_assign[playerId]
      
      // Validar que la suma no exceda los puntos disponibles
      if (totalPoints !== availablePoints) {
        console.error(`Error: Total points (${totalPoints}) doesn't match available points (${availablePoints})`)
        return state
      }
      
      return {
        game: {
          ...state.game,
          cards_to_deal: {
            ...state.game.cards_to_deal,
            [playerId]: state.game.cards_to_deal[playerId] + pointsToCards
          },
          points_to_assign: {
            ...state.game.points_to_assign,
            [playerId]: 0 // Resetear puntos asignados
          }
        },
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            score: {
              ...state.players[playerId].score,
              score: state.players[playerId].score.score + pointsToScore
            }
          }
        }
      }
    })
  }

  /**
   * Verifica si todos los jugadores han asignado sus puntos
   */
  const allPlayersAssignedPoints = (): boolean => {
    return game.active_players.every(
      playerId => game.points_to_assign[playerId] === 0
    )
  }

  return {
    executeCheckout,
    assignPoints,
    allPlayersAssignedPoints,
    getPointsToAssign: (playerId: PlayerId) => game.points_to_assign[playerId],
    getCardsToDeal: (playerId: PlayerId) => game.cards_to_deal[playerId]
  }
}
