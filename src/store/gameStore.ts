import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PlayingCard, Player, Game, PlayerId, PlayerScore, GuestCard, Initial, TablePlay } from '../types/types'
import { AVAILABLE_PLAYERS, ROUND_PHASE_ORDER } from '../types/types'
import deckData from '../data/deck-inn.json'
import roomsData from '../data/deck-rooms.json'
import guestDeckData from '../data/deck-characters.json'
import eventsData from '../data/events.json'
import type { RoomCard, Event } from '../types/types'

interface GameState {
  // Estado del juego
  game: Game
  // Estado de los 4 jugadores
  players: Record<PlayerId, Player>
  
  // Acciones
  initializeGame: () => void
  dealCardsToAllPlayers: (cardsPerPlayer: number) => void
  selectCard: (playerId: PlayerId, cardId: number, initials?: Initial[]) => void
  deselectCards: (playerId: PlayerId) => void
  playCard: (playerId: PlayerId, cardId: number) => void
  updateBid: (newBid: GuestCard[] | null) => void
  calculateCardPoints: (card: PlayingCard, bid: GuestCard | null) => 1 | 2 | 3 | 4
  nextTurn: () => void
  confirmTableCards: (playerId: PlayerId) => void
  returnUnconfirmedCards: (playerId: PlayerId) => void
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
  players: Record<PlayerId, Player>,
  bid: GuestCard | null
): Record<PlayerId, Player> => {
  const updatedPlayers = { ...players }
  const bidCard = bid
  
  Object.keys(updatedPlayers).forEach((playerId) => {
    const player = updatedPlayers[playerId as PlayerId]
    updatedPlayers[playerId as PlayerId] = {
      ...player,
      hand: player.hand.map(card => ({
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
  
  console.log('🔍 checkCompletableEvents - hand:', hand.length, 'cartas')
  
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
      // Buscar eventos con esta inicial
      const eventsWithInitial = events.filter(event => event.initial === initial)
      
      eventsWithInitial.forEach(event => {
        // Obtener todos los productos disponibles en las cartas
        const availableProducts = cards.map(card => card.product)
        
        // Verificar si todos los requirements del evento están en las cartas
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

// Crear el score inicial vacío para un jugador
const createInitialScore = (): PlayerScore => ({
  former_guests: [],
  events: [],
  secret_objective: { suit: 'locals', product: [] },
  secret_score: 0,
  score: 0,
  can_score_event: null
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
            has_coincidence: null,
            pointsInThisBid: 1 as 1 | 2 | 3 | 4,
            state: 'in_deck' as const
          }))
          const shuffledGuestDeck = shuffleArray(guestDeckData as GuestCard[])
          
          // Repartir la primera carta del guest deck al bid
          const bidCard = shuffledGuestDeck.length > 0 ? shuffledGuestDeck[0] : null
          const remainingGuestDeck = shuffledGuestDeck.slice(1)
          
          return {
            game: {
              ...state.game,
              deck: shuffledDeck,
              guest_deck: remainingGuestDeck,
              bid: bidCard ? [bidCard] : null
            }
          }
        })
      },

      // Repartir cartas a todos los jugadores
      dealCardsToAllPlayers: (cardsPerPlayer: number = 6) => {
        set((state) => {
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
      },

      // Seleccionar una carta y calcular coincidencias
      selectCard: (playerId: PlayerId, cardId: number, initials?: Initial[]) => {
        set((state) => {
          const player = state.players[playerId]
          const selectedCard = player.hand.find(c => c.id === cardId)
          
          if (!selectedCard) return state
          
          // Si no hay initials, calcular qué initials de la carta seleccionada tienen coincidencias
          let selectedCardCoincidences: Initial[] | null = null
          
          if (!initials) {
            const tempCoincidences: Initial[] = []
            
            // Revisar si first_row tiene coincidencias con otras cartas
            const hasFirstRowMatch = player.hand.some(
              c => c.id !== cardId && (c.first_row === selectedCard.first_row || c.second_row === selectedCard.first_row)
            )
            if (hasFirstRowMatch) {
              tempCoincidences.push(selectedCard.first_row as Initial)
            }
            
            // Revisar si second_row tiene coincidencias con otras cartas
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
              // Esta es la carta seleccionada
              return {
                ...card,
                is_selected: true,
                has_coincidence: selectedCardCoincidences
              }
            } else {
              // Calcular coincidencias con la carta seleccionada
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

      // Actualizar el bid y recalcular puntos de todas las cartas
      updateBid: (newBid: GuestCard[] | null) => {
        set((state) => {
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
      },

      // Función helper para calcular puntos (expuesta para uso externo si es necesario)
      calculateCardPoints: (card: PlayingCard, bid: GuestCard | null) => {
        return calculateCardPoints(card, bid)
      },

      // Avanzar al siguiente turno (rotación circular)
      nextTurn: () => {
        set((state) => {
          const currentIndex = state.game.active_players.indexOf(state.game.player_turn)
          const nextIndex = (currentIndex + 1) % state.game.active_players.length
          const nextPlayerId = state.game.active_players[nextIndex]
          
          return {
            game: {
              ...state.game,
              player_turn: nextPlayerId
            }
          }
        })
      },

      // Devolver cartas no confirmadas a la mano del jugador
      returnUnconfirmedCards: (playerId: PlayerId) => {
        set((state) => {
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
          
          // Devolver cartas no confirmadas a la mano con estado in_hand
          const cardsToReturn = unconfirmedCards.map(card => ({
            ...card,
            state: 'in_hand' as const,
            is_selected: false,
            has_coincidence: null
          }))
          
          // Actualizar la mano del jugador
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
          
          // Si solo hay cartas discount, allowed_cards es null (se puede jugar cualquier carta)
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
      },

      // Confirmar las cartas jugadas en la mesa (cambiar estado a confirmed_in_table)
      confirmTableCards: (playerId: PlayerId) => {
        set((state) => {
          const currentTablePlay = state.game.table_plays[playerId]
          
          if (!currentTablePlay) return state
          
          // Cambiar el estado de todas las cartas a confirmed_in_table
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
          
          // Obtener el TablePlay actual o crear uno nuevo
          const currentTablePlay = state.game.table_plays[playerId]
          const currentPlayedCards = currentTablePlay?.played_cards || []
          const currentAllowedCards = currentTablePlay?.allowed_cards || []
          
          // Agregar carta a played_cards
          const updatedPlayedCards = [...currentPlayedCards, {
            ...cardToPlay,
            is_selected: false,
            has_coincidence: null,
            state: 'unconfirmed_in_table' as const
          }]
          
          // Calcular allowed_cards contando ocurrencias de cada initial
          // Las cartas tipo 'discount' son comodines y no contribuyen al conteo
          const initialCounts: Record<string, number> = {}
          
          updatedPlayedCards.forEach(card => {
            // Ignorar cartas discount en el cálculo de allowed_cards
            if (card.suit === 'discount') return
            
            const firstRow = card.first_row as Initial
            const secondRow = card.second_row as Initial
            
            initialCounts[firstRow] = (initialCounts[firstRow] || 0) + 1
            initialCounts[secondRow] = (initialCounts[secondRow] || 0) + 1
          })
          
          // Si solo hay cartas discount, allowed_cards es null (se puede jugar cualquier carta)
          // Si hay cartas no-discount, calcular las iniciales permitidas
          let newAllowedCards: Initial[] | null = null
          
          if (Object.keys(initialCounts).length > 0) {
            // Encontrar la cantidad máxima
            const maxCount = Math.max(...Object.values(initialCounts))
            
            // Filtrar solo las iniciales con la cantidad máxima
            newAllowedCards = Object.entries(initialCounts)
              .filter(([_, count]) => count === maxCount)
              .map(([initial, _]) => initial as Initial)
          }
          
          // Calcular meld_score sumando todos los pointsInThisBid
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
    }),
    { name: 'GameStore' }
  )
)
