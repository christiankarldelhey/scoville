import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PlayingCard, Player, Game, PlayerId, PlayerScore, GuestCard, Initial } from '../types/types'
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
  selectCard: (playerId: PlayerId, cardId: number) => void
  deselectCards: (playerId: PlayerId) => void
  playCard: (playerId: PlayerId, cardId: number) => void
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

      // Inicializar el juego: mezclar decks y agregar campos de selección
      initializeGame: () => {
        set((state) => {
          const shuffledDeck = shuffleArray(deckData as PlayingCard[]).map(card => ({
            ...card,
            is_selected: false,
            has_coincidence: null
          }))
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
      },

      // Seleccionar una carta y calcular coincidencias
      selectCard: (playerId: PlayerId, cardId: number) => {
        set((state) => {
          const player = state.players[playerId]
          const selectedCard = player.hand.find(c => c.id === cardId)
          
          if (!selectedCard) return state
          
          // Actualizar todas las cartas de la mano
          const updatedHand = player.hand.map(card => {
            if (card.id === cardId) {
              // Esta es la carta seleccionada
              return {
                ...card,
                is_selected: true,
                has_coincidence: null
              }
            } else {
              // Calcular coincidencias con la carta seleccionada
              const coincidences: Initial[] = []
              
              if (card.first_row === selectedCard.first_row) {
                coincidences.push(card.first_row as Initial)
              }
              if (card.second_row === selectedCard.second_row) {
                coincidences.push(card.second_row as Initial)
              }
              
              return {
                ...card,
                is_selected: false,
                has_coincidence: coincidences.length > 0 ? coincidences : null
              }
            }
          })
          
          return {
            players: {
              ...state.players,
              [playerId]: {
                ...player,
                hand: updatedHand
              }
            }
          }
        })
      },

      // Deseleccionar todas las cartas
      deselectCards: (playerId: PlayerId) => {
        set((state) => {
          const player = state.players[playerId]
          
          const updatedHand = player.hand.map(card => ({
            ...card,
            is_selected: false,
            has_coincidence: null
          }))
          
          return {
            players: {
              ...state.players,
              [playerId]: {
                ...player,
                hand: updatedHand
              }
            }
          }
        })
      },

      // Jugar una carta (moverla de hand a table_plays)
      playCard: (playerId: PlayerId, cardId: number) => {
        set((state) => {
          const player = state.players[playerId]
          const cardToPlay = player.hand.find(c => c.id === cardId)
          
          if (!cardToPlay) return state
          
          // Remover carta de la mano y resetear su estado de selección
          const updatedHand = player.hand
            .filter(c => c.id !== cardId)
            .map(card => ({
              ...card,
              is_selected: false,
              has_coincidence: null
            }))
          
          // Agregar carta a table_plays
          const currentTablePlays = state.game.table_plays[playerId] || []
          const updatedTablePlays = [...currentTablePlays, {
            ...cardToPlay,
            is_selected: false,
            has_coincidence: null,
            state: 'in_table' as const
          }]
          
          return {
            game: {
              ...state.game,
              table_plays: {
                ...state.game.table_plays,
                [playerId]: updatedTablePlays
              }
            },
            players: {
              ...state.players,
              [playerId]: {
                ...player,
                hand: updatedHand
              }
            }
          }
        })
      }
    }),
    { name: 'GameStore' }
  )
)
