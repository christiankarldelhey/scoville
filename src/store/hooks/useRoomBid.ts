import { useGameStore } from '../gameStore'
import type { PlayerId, RoomCard, TablePlay } from '../../types/types'

/**
 * Hook para la fase de puja por habitaciones (room_bid)
 * Los jugadores seleccionan una habitación libre para jugar
 */
export const useRoomBid = () => {

  /**
   * Selecciona una habitación libre y la asigna al TablePlay del jugador
   * Luego avanza al siguiente turno o a la siguiente fase si todos han elegido
   */
  const selectRoom = (playerId: PlayerId, roomId: number) => {
    useGameStore.setState((state) => {
      const player = state.players[playerId]
      const room = player.rooms.find(r => r.id === roomId)
      
      if (!room || room.guest) {
        console.warn('Habitación no disponible o ya ocupada')
        return state
      }
      
      // Obtener el TablePlay actual o crear uno nuevo
      const currentTablePlay = state.game.table_plays[playerId]
      
      const updatedTablePlay: TablePlay = {
        played_cards: currentTablePlay?.played_cards || [],
        allowed_cards: currentTablePlay?.allowed_cards || null,
        meld_score: currentTablePlay?.meld_score || 0,
        room_card: room
      }
      
      // Actualizar table_plays con la habitación seleccionada
      const updatedTablePlays = {
        ...state.game.table_plays,
        [playerId]: updatedTablePlay
      }
      
      // Verificar si todos los jugadores activos han seleccionado una habitación
      // Contamos cuántos jugadores ya tienen room_card (debe existir el tablePlay Y tener room_card)
      const playersWithRoom = state.game.active_players.filter(
        (pid) => updatedTablePlays[pid] !== null && updatedTablePlays[pid]?.room_card !== null
      ).length
      
      const allPlayersHaveSelectedRoom = playersWithRoom === state.game.active_players.length
      
      console.log('🏠 Room Selection Debug:', {
        playerId,
        roomId,
        playersWithRoom,
        totalActivePlayers: state.game.active_players.length,
        allPlayersHaveSelectedRoom,
        updatedTablePlays: Object.entries(updatedTablePlays).map(([pid, tp]) => ({
          playerId: pid,
          tablePlayExists: tp !== null,
          hasRoomCard: tp !== null && tp.room_card !== null
        }))
      })
      
      // Si todos han seleccionado, avanzar a guest_bid_1
      if (allPlayersHaveSelectedRoom) {
        return {
          game: {
            ...state.game,
            roundPhase: 'guest_bid_1',
            player_turn: state.game.key_owner, // El key_owner inicia guest_bid_1
            table_plays: updatedTablePlays
          }
        }
      }
      
      // Si no todos han seleccionado, avanzar al siguiente turno
      const currentIndex = state.game.active_players.indexOf(playerId)
      const nextIndex = (currentIndex + 1) % state.game.active_players.length
      const nextPlayerId = state.game.active_players[nextIndex]
      
      return {
        game: {
          ...state.game,
          player_turn: nextPlayerId,
          table_plays: updatedTablePlays
        }
      }
    })
  }

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
    selectRoom,
    startRoomBid,
    placeBid,
    passBid,
    resolveRoomBid
  }
}
