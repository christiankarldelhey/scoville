import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PlayingCard, Player, Game, PlayerId, PlayerScore, GuestCard } from '../types/types'
import { AVAILABLE_PLAYERS, ROUND_PHASE_ORDER } from '../types/types'
import deckData from '../data/deck-inn.json'
import roomsData from '../data/deck-rooms.json'
import guestDeckData from '../data/deck-characters.json'
import type { RoomCard } from '../types/types'
import { PlayerScoreExample } from '../data/player-score-example'

interface GameState {
  // Estado del juego
  game: Game
  // Estado de los 4 jugadores
  players: Record<PlayerId, Player>
  
  // Acciones
  initializeGame: () => void
  dealCardsToAllPlayers: (cardsPerPlayer: number) => void
}

const getRoomsFromPlayer = (player_id: PlayerId): RoomCard[] => {
  const rooms = roomsData as RoomCard[]
  const playerRooms = rooms.filter((room) => room.owner === player_id)
  return playerRooms
}

// Función para mezclar cartas usando Fisher-Yates shuffle
const shuffleArray = <T,>(items: T[]): T[] => {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Crear el score inicial vacío para un jugador
const createInitialScore = (): PlayerScore => ({
  ...PlayerScoreExample
})

// Inicializar los 4 jugadores
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
    (set) => ({
      // Estado inicial del juego
      game: {
        round: 1,
        roundPhaseOrder: ROUND_PHASE_ORDER,
        roundPhase: 'game_preparation',
        active_players: ['player_1', 'player_2', 'player_3', 'player_4'],
        key_owner: 'player_1',
        player_turn: 'player_1',
        deck: [],
        discard_pile: [],
        guest_deck: [],
        bid: null,
        table_plays: {
          player_1: null,
          player_2: null,
          player_3: null,
          player_4: null
        }
      },
      
      // Estado inicial de los 4 jugadores
      players: initializePlayers(),

      // Inicializar el juego: mezclar decks
      initializeGame: () => {
        set((state) => {
          const shuffledDeck = shuffleArray(deckData as PlayingCard[])
          const shuffledGuestDeck = shuffleArray(guestDeckData as GuestCard[])
          
          return {
            game: {
              ...state.game,
              deck: shuffledDeck,
              guest_deck: shuffledGuestDeck
            }
          }
        })
      },

      // Repartir cartas a todos los jugadores
      dealCardsToAllPlayers: (cardsPerPlayer: number = 6) => {
        set((state) => {
          const updatedPlayers = { ...state.players }
          let remainingDeck = [...state.game.deck]
          
          // Repartir cartas a cada jugador en orden
          state.game.active_players.forEach((playerId) => {
            const dealtCards = remainingDeck.slice(0, cardsPerPlayer)
            remainingDeck = remainingDeck.slice(cardsPerPlayer)
            
            updatedPlayers[playerId] = {
              ...updatedPlayers[playerId],
              hand: dealtCards
            }
          })
          
          return {
            game: {
              ...state.game,
              deck: remainingDeck
            },
            players: updatedPlayers
          }
        })
      }
    }),
    { name: 'GameStore' }
  )
)
