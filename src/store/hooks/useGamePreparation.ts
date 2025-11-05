import { useGameStore } from '../gameStore'
import type { PlayingCard, GuestCard } from '../../types/types'
import deckData from '../../data/deck-inn.json'
import guestDeckData from '../../data/deck-characters.json'

// Función para mezclar cartas usando Fisher-Yates shuffle
const shuffleArray = <T,>(items: T[]): T[] => {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Calcular puntos de todas las cartas repartidas basándose en el huesped actual
const calculateCardPoints = (card: PlayingCard, bid: GuestCard | null): 1 | 2 | 3 | 4 => {
  if (!bid) return 1
  
  const suitMatches = card.suit === bid.suit
  const productMatches = card.product === bid.product
  
  if (suitMatches && productMatches) return 4
  if (productMatches && !suitMatches) return 3
  if (!productMatches && suitMatches) return 2
  return 1
}

/**
 * Hook para la fase de preparación del juego
 * Maneja la inicialización y el reparto inicial de cartas
 */
export const useGamePreparation = () => {
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)

  /**
   * Inicializa el juego: mezcla los decks y establece el bid inicial
   */
  const initializeGame = () => {
    const shuffledDeck = shuffleArray(deckData as PlayingCard[]).map(card => ({
      ...card,
      is_selected: false,
      has_coincidence: null,
      pointsInThisBid: 1 as 1 | 2 | 3 | 4,
      state: 'in_deck' as const
    }))
    const shuffledGuestDeck = shuffleArray(guestDeckData as GuestCard[])
    
    // Repartir las primeras 2 cartas del guest deck al bid
    const bidCards = shuffledGuestDeck.slice(0, 2)
    const remainingGuestDeck = shuffledGuestDeck.slice(2)
    
    useGameStore.setState((state) => ({
      game: {
        ...state.game,
        deck: shuffledDeck,
        guest_deck: remainingGuestDeck,
        bid: bidCards.length === 2 ? bidCards : null
      }
    }))
  }

  /**
   * Reparte cartas a todos los jugadores activos
   */
  const dealCardsToAllPlayers = (cardsPerPlayer: number = 6) => {
    useGameStore.setState((state) => {
      const updatedPlayers = { ...state.players }
      let remainingDeck = [...state.game.deck]
      const bidCard = state.game.bid?.[0] || null
      
      // Repartir cartas a cada jugador en orden
      state.game.active_players.forEach((playerId) => {
        const dealtCards = remainingDeck.slice(0, cardsPerPlayer).map(card => ({
          ...card,
          pointsInThisBid: calculateCardPoints(card, bidCard),
          state: 'in_hand' as const
        }))
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

  /**
   * Reinicia el juego al estado inicial
   */
  const resetGame = () => {
    // TODO: Implementar reset completo del juego
    console.log('resetGame - Por implementar')
  }

  return {
    // Estado
    deck: game.deck,
    guestDeck: game.guest_deck,
    bid: game.bid,
    
    // Métodos
    initializeGame,
    dealCardsToAllPlayers,
    resetGame
  }
}
