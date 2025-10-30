import { useGameStore } from '../gameStore'
import type { PlayerId, PlayingCard, GuestCard, Initial, TablePlay } from '../../types/types'
import eventsData from '../../data/events.json'
import type { Event } from '../../types/types'

// Calcular puntos de una carta basándose en el bid
const calculateCardPoints = (card: PlayingCard, bid: GuestCard | null): 1 | 2 | 3 | 4 => {
  if (!bid) return 1
  
  const suitMatches = card.suit === bid.suit
  const productMatches = card.product === bid.product
  
  if (suitMatches && productMatches) return 4
  if (productMatches && !suitMatches) return 3
  if (!productMatches && suitMatches) return 2
  return 1
}

// Actualizar puntos de todas las cartas en las manos de los jugadores
const updateAllPlayersCardPoints = (
  players: Record<PlayerId, any>,
  bid: GuestCard | null
) => {
  const updatedPlayers = { ...players }
  const bidCard = bid
  
  Object.keys(updatedPlayers).forEach((playerId) => {
    const player = updatedPlayers[playerId as PlayerId]
    updatedPlayers[playerId as PlayerId] = {
      ...player,
      hand: player.hand.map((card: PlayingCard) => ({
        ...card,
        pointsInThisBid: calculateCardPoints(card, bidCard)
      }))
    }
  })
  
  return updatedPlayers
}

// Verificar si un conjunto de cartas puede completar un evento
const checkCompletableEvents = (hand: PlayingCard[]): Event[] | null => {
  const events = eventsData as Event[]
  const completableEvents: Event[] = []
  
  // Agrupar cartas por letra en has_coincidence
  const cardsByInitial: Record<string, PlayingCard[]> = {}
  
  hand.forEach(card => {
    if (card.has_coincidence && card.has_coincidence.length > 0) {
      card.has_coincidence.forEach(initial => {
        if (!cardsByInitial[initial]) {
          cardsByInitial[initial] = []
        }
        cardsByInitial[initial].push(card)
      })
    }
  })
  
  // Para cada letra que tenga 3 o más cartas, verificar eventos
  Object.entries(cardsByInitial).forEach(([initial, cards]) => {
    if (cards.length >= 3) {
      const eventsWithInitial = events.filter(event => event.initial === initial)
      
      eventsWithInitial.forEach(event => {
        const availableProducts = cards.map(card => card.product)
        const canComplete = event.requirements.every(requirement => 
          availableProducts.includes(requirement)
        )
        
        if (canComplete) {
          completableEvents.push(event)
        }
      })
    }
  })
  
  return completableEvents.length > 0 ? completableEvents : null
}

/**
 * Hook para gestionar las cartas: selección, juego, confirmación
 */
export const useCardManagement = () => {
  const game = useGameStore((state) => state.game)
  const players = useGameStore((state) => state.players)

  /**
   * Selecciona una carta y calcula coincidencias con otras cartas
   */
  const selectCard = (playerId: PlayerId, cardId: number, initials?: Initial[]) => {
    useGameStore.setState((state) => {
      const player = state.players[playerId]
      const selectedCard = player.hand.find(c => c.id === cardId)
      
      if (!selectedCard) return state
      
      // Calcular coincidencias
      let selectedCardCoincidences: Initial[] | null = null
      
      if (!initials) {
        const tempCoincidences: Initial[] = []
        
        const hasFirstRowMatch = player.hand.some(
          c => c.id !== cardId && (c.first_row === selectedCard.first_row || c.second_row === selectedCard.first_row)
        )
        if (hasFirstRowMatch) {
          tempCoincidences.push(selectedCard.first_row as Initial)
        }
        
        const hasSecondRowMatch = player.hand.some(
          c => c.id !== cardId && (c.first_row === selectedCard.second_row || c.second_row === selectedCard.second_row)
        )
        if (hasSecondRowMatch) {
          tempCoincidences.push(selectedCard.second_row as Initial)
        }
        
        selectedCardCoincidences = tempCoincidences.length > 0 ? tempCoincidences : null
      } else {
        selectedCardCoincidences = initials
      }
      
      // Actualizar todas las cartas de la mano
      const updatedHand = player.hand.map(card => {
        if (card.id === cardId) {
          return {
            ...card,
            is_selected: true,
            has_coincidence: selectedCardCoincidences
          }
        } else {
          const coincidences: Initial[] = []
          const selectedCardInitials = initials || [selectedCard.first_row, selectedCard.second_row]

          if (selectedCardInitials.includes(card.first_row as Initial)) {
            coincidences.push(card.first_row as Initial)
          }
          if (selectedCardInitials.includes(card.second_row as Initial)) {
            coincidences.push(card.second_row as Initial)
          }
          
          return {
            ...card,
            is_selected: false,
            has_coincidence: coincidences.length > 0 ? coincidences : null
          }
        }
      })
      
      // Verificar eventos completables
      const completableEvents = checkCompletableEvents(updatedHand)
      
      return {
        players: {
          ...state.players,
          [playerId]: {
            ...player,
            hand: updatedHand,
            score: {
              ...player.score,
              can_score_event: completableEvents
            }
          }
        }
      }
    })
  }

  /**
   * Deselecciona todas las cartas de un jugador
   */
  const deselectCards = (playerId: PlayerId) => {
    useGameStore.setState((state) => {
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
  }

  /**
   * Juega una carta de la mano a la mesa (table_plays)
   */
  const playCard = (playerId: PlayerId, cardId: number) => {
    useGameStore.setState((state) => {
      const player = state.players[playerId]
      const cardToPlay = player.hand.find(c => c.id === cardId)
      
      if (!cardToPlay) return state
      
      // Remover carta de la mano
      const updatedHand = player.hand
        .filter(c => c.id !== cardId)
        .map(card => ({
          ...card,
          is_selected: false,
          has_coincidence: null
        }))
      
      // Obtener el TablePlay actual o crear uno nuevo
      const currentTablePlay = state.game.table_plays[playerId]
      const currentPlayedCards = currentTablePlay?.played_cards || []
      
      // Agregar carta a played_cards
      const updatedPlayedCards = [...currentPlayedCards, {
        ...cardToPlay,
        is_selected: false,
        has_coincidence: null,
        state: 'unconfirmed_in_table' as const
      }]
      
      // Calcular allowed_cards
      const initialCounts: Record<string, number> = {}
      
      updatedPlayedCards.forEach(card => {
        if (card.suit === 'discount') return
        
        const firstRow = card.first_row as Initial
        const secondRow = card.second_row as Initial
        
        initialCounts[firstRow] = (initialCounts[firstRow] || 0) + 1
        initialCounts[secondRow] = (initialCounts[secondRow] || 0) + 1
      })
      
      let newAllowedCards: Initial[] | null = null
      
      if (Object.keys(initialCounts).length > 0) {
        const maxCount = Math.max(...Object.values(initialCounts))
        newAllowedCards = Object.entries(initialCounts)
          .filter(([_, count]) => count === maxCount)
          .map(([initial, _]) => initial as Initial)
      }
      
      // Calcular meld_score
      const meldScore = updatedPlayedCards.reduce((sum, card) => {
        return sum + (card.pointsInThisBid || 0)
      }, 0)
      
      const updatedTablePlay: TablePlay = {
        played_cards: updatedPlayedCards,
        allowed_cards: newAllowedCards,
        meld_score: meldScore,
        room_card: currentTablePlay?.room_card || null
      }
      
      return {
        game: {
          ...state.game,
          table_plays: {
            ...state.game.table_plays,
            [playerId]: updatedTablePlay
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

  /**
   * Confirma las cartas jugadas en la mesa (cambiar estado a confirmed_in_table)
   */
  const confirmTableCards = (playerId: PlayerId) => {
    useGameStore.setState((state) => {
      const currentTablePlay = state.game.table_plays[playerId]
      
      if (!currentTablePlay) return state
      
      const confirmedCards = currentTablePlay.played_cards.map(card => ({
        ...card,
        state: 'confirmed_in_table' as const
      }))
      
      return {
        game: {
          ...state.game,
          table_plays: {
            ...state.game.table_plays,
            [playerId]: {
              ...currentTablePlay,
              played_cards: confirmedCards
            }
          }
        }
      }
    })
  }

  /**
   * Devuelve las cartas no confirmadas de la mesa a la mano
   */
  const returnUnconfirmedCards = (playerId: PlayerId) => {
    useGameStore.setState((state) => {
      const currentTablePlay = state.game.table_plays[playerId]
      const player = state.players[playerId]
      
      if (!currentTablePlay) return state
      
      // Separar cartas confirmadas de no confirmadas
      const confirmedCards = currentTablePlay.played_cards.filter(
        card => card.state === 'confirmed_in_table'
      )
      const unconfirmedCards = currentTablePlay.played_cards.filter(
        card => card.state === 'unconfirmed_in_table'
      )
      
      // Devolver cartas no confirmadas a la mano
      const cardsToReturn = unconfirmedCards.map(card => ({
        ...card,
        state: 'in_hand' as const,
        is_selected: false,
        has_coincidence: null
      }))
      
      const updatedHand = [...player.hand, ...cardsToReturn]
      
      // Recalcular allowed_cards y meld_score solo con cartas confirmadas
      const initialCounts: Record<string, number> = {}
      
      confirmedCards.forEach(card => {
        if (card.suit === 'discount') return
        
        const firstRow = card.first_row as Initial
        const secondRow = card.second_row as Initial
        
        initialCounts[firstRow] = (initialCounts[firstRow] || 0) + 1
        initialCounts[secondRow] = (initialCounts[secondRow] || 0) + 1
      })
      
      let newAllowedCards: Initial[] | null = null
      
      if (Object.keys(initialCounts).length > 0) {
        const maxCount = Math.max(...Object.values(initialCounts))
        newAllowedCards = Object.entries(initialCounts)
          .filter(([_, count]) => count === maxCount)
          .map(([initial, _]) => initial as Initial)
      }
      
      const meldScore = confirmedCards.reduce((sum, card) => {
        return sum + (card.pointsInThisBid || 0)
      }, 0)
      
      // Si no hay cartas confirmadas, eliminar el TablePlay
      const updatedTablePlay = confirmedCards.length > 0 ? {
        played_cards: confirmedCards,
        allowed_cards: newAllowedCards,
        meld_score: meldScore,
        room_card: currentTablePlay.room_card
      } : null
      
      return {
        game: {
          ...state.game,
          table_plays: {
            ...state.game.table_plays,
            [playerId]: updatedTablePlay
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

  /**
   * Actualiza el bid y recalcula puntos de todas las cartas
   */
  const updateBid = (newBid: GuestCard[] | null) => {
    useGameStore.setState((state) => {
      const bidCard = newBid?.[0] || null
      const updatedPlayers = updateAllPlayersCardPoints(state.players, bidCard)
      
      return {
        game: {
          ...state.game,
          bid: newBid
        },
        players: updatedPlayers
      }
    })
  }

  return {
    // Estado
    bid: game.bid,
    tablePlays: game.table_plays,
    
    // Métodos
    selectCard,
    deselectCards,
    playCard,
    confirmTableCards,
    returnUnconfirmedCards,
    updateBid,
    calculateCardPoints
  }
}
