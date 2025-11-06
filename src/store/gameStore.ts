import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Player, Game, PlayerId, PlayerScore } from '../types/types'
import { AVAILABLE_PLAYERS, ROUND_PHASE_ORDER } from '../types/types'
import roomsData from '../data/deck-rooms.json'
import type { RoomCard } from '../types/types'

interface GameState {
  // Estado del juego
  game: Game
  // Estado de los 4 jugadores
  players: Record<PlayerId, Player>
}

const getRoomsFromPlayer = (player_id: PlayerId): RoomCard[] => {
  const rooms = roomsData as RoomCard[]
  const playerRooms = rooms.filter((room) => room.owner === player_id)
  return playerRooms
}

/**
 * Crea el score inicial vacío para un jugador
 */
const createInitialScore = (): PlayerScore => ({
  former_guests: [],
  events: [],
  secret_objective: { suit: 'locals', product: [] },
  secret_score: 0,
  score: 0,
  can_score_event: null
})


const initializePlayers = (): Record<PlayerId, Player> => {
  const players: Record<string, Player> = {}
  
  AVAILABLE_PLAYERS.forEach((availablePlayer) => {
    players[availablePlayer.id] = {
      player_id: availablePlayer.id,
      avatar: availablePlayer.defaultAvatar,
      color: availablePlayer.color,
      name: `Player ${availablePlayer.id.split('_')[1]}`,
      hand: [],
      rooms: getRoomsFromPlayer(availablePlayer.id),
      score: createInitialScore()
    }
  })
  
  return players as Record<PlayerId, Player>
}


export const useGameStore = create<GameState>()(
  devtools(
    () => ({
      // Estado inicial del juego
      game: {
        round: 1,
        roundPhaseOrder: ROUND_PHASE_ORDER,
        roundPhase: 'game_preparation',
        active_players: ['player_1', 'player_2', 'player_3', 'player_4'],
        key_owner: 'player_1',
        player_turn: 'player_1',
        players_ready: {
          player_1: false,
          player_2: false,
          player_3: false,
          player_4: false
        },
        deck: [],
        discard_pile: [],
        guest_deck: [],
        cards_to_deal: {
          player_1: 0,
          player_2: 0,
          player_3: 0,
          player_4: 0
        },
        points_to_assign: {
          player_1: 0,
          player_2: 0,
          player_3: 0,
          player_4: 0
        },
        bid: null,
        bid_next_round: null,
        guests_to_bid: null,
        table_plays: {
          player_1: null,
          player_2: null,
          player_3: null,
          player_4: null
        }
      },
      
      // Estado inicial de los 4 jugadores
      players: initializePlayers()
    }),
    { name: 'GameStore' }
  )
)
