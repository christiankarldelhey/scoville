import { useGameStore } from '../gameStore'
import type { PlayerId, RoomCard } from '../../types/types'

/**
 * Hook para la fase de puja por habitaciones (room_bid)
 * Los jugadores pujan por habitaciones disponibles
 */
export const useRoomBid = () => {
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)

  /**
   * Inicia la puja por una habitación
   * TODO: Implementar
   */
  const startRoomBid = (room: RoomCard) => {
    console.log('startRoomBid - Por implementar', room)
  }

  /**
   * Un jugador hace una puja
   * TODO: Implementar
   */
  const placeBid = (playerId: PlayerId, bidAmount: number) => {
    console.log('placeBid - Por implementar', playerId, bidAmount)
  }

  /**
   * Un jugador pasa en la puja
   * TODO: Implementar
   */
  const passBid = (playerId: PlayerId) => {
    console.log('passBid - Por implementar', playerId)
  }

  /**
   * Resuelve la puja y asigna la habitación al ganador
   * TODO: Implementar
   */
  const resolveRoomBid = () => {
    console.log('resolveRoomBid - Por implementar')
  }

  return {
    // Estado
    currentBid: null, // TODO: Agregar al game state
    
    // Métodos
    startRoomBid,
    placeBid,
    passBid,
    resolveRoomBid
  }
}
