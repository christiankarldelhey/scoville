import { useGameStore } from './gameStore'

/**
 * Hook para acceder al jugador
 */
export const usePlayer = () => {
  return useGameStore((state) => state.player)
}

/**
 * Hook para acceder al mazo
 */
export const useDeck = () => {
  return useGameStore((state) => ({
    deck: state.deck,
    deckSize: state.deck.length
  }))
}

/**
 * Hook para acceder a las acciones del juego
 */
export const useGameActions = () => {
  return useGameStore((state) => ({
    shuffleCards: state.shuffleCards,
    dealCards: state.dealCards,
    initializeDeck: state.initializeDeck
  }))
}
