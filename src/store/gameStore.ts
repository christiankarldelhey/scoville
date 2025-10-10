import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PlayingCard, Player } from '../types/types'
import deckData from '../data/deck.json'

interface GameState {
  // Estado (solo lo que existía en useGame)
  deck: PlayingCard[]
  player: Player
  
  // Acciones (solo las que existían en useGame)
  shuffleCards: (cards: PlayingCard[]) => PlayingCard[]
  dealCards: (numCards?: number) => void
  initializeDeck: () => void
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
        player_id: { player_id: 'Player_1' },
        avatar: 'avatar1.png',
        color: '#FF5733',
        name: 'Player 1',
        hand: []
      },

      // Función para mezclar las cartas
      shuffleCards: (cards: PlayingCard[]) => {
        return shuffleArray(cards)
      },

      // Función para repartir cartas
      dealCards: (numCards: number = 5) => {
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
        })
      },

      // Inicializar y mezclar el deck
      initializeDeck: () => {
        const shuffledDeck = shuffleArray(deckData as PlayingCard[])
        set({ deck: shuffledDeck })
      }
    }),
    { name: 'GameStore' }
  )
)
