import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PlayingCard, Player } from '../types/types'
import deckData from '../data/deck-inn.json'
import roomsData from '../data/deck-rooms.json'
import type { RoomCard } from '../types/types'
import type { PlayerId } from '../types/types'

interface GameState {
  // Estado (solo lo que existía en useGame)
  deck: PlayingCard[]
  player: Player
  
  // Acciones (solo las que existían en useGame)
  shuffleCards: (cards: PlayingCard[]) => PlayingCard[]
  dealCards: (numCards?: number) => void
  initializeDeck: () => void
}

const getRoomsFromPlayer = (player_id: PlayerId) => {
  const rooms = roomsData as RoomCard[]
  const playerRooms = rooms.filter((room) => room.owner === player_id)
  return playerRooms
}

// Función para mezclar cartas usando Fisher-Yates shuffle
const shuffleArray = (cards: PlayingCard[]): PlayingCard[] => {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const useGameStore = create<GameState>()(
  devtools(
    (set) => ({
      // Estado inicial
      deck: [],
      player: {
        player_id: { player_id: 'player_1' },
        avatar: 'avatar1.png',
        color: '#FF5733',
        name: 'Player 1',
        rooms: getRoomsFromPlayer({ player_id: 'player_1' }),
        hand: []
      },

      // Función para mezclar las cartas
      shuffleCards: (cards: PlayingCard[]) => {
        return shuffleArray(cards)
      },

      // Función para repartir cartas
      dealCards: (numCards: number = 6) => {
        set((state) => {
          const dealtCards = state.deck.slice(0, numCards)
          const remainingDeck = state.deck.slice(numCards)
          
          return {
            deck: remainingDeck,
            player: {
              ...state.player,
              hand: dealtCards
            }
          }
        }, false, 'dealCards')
      },

      // Inicializar y mezclar el deck
      initializeDeck: () => {
        const shuffledDeck = shuffleArray(deckData as PlayingCard[])
        set({ deck: shuffledDeck }, false, 'initializeDeck')
      }
    }),
    { 
      name: 'GameStore',
      enabled: true
    }
  )
)
