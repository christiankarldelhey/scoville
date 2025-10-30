import React, { useRef, useEffect } from 'react'
import type { Player } from '../../types/types'
import { PlayingCard } from '../../components/common/PlayingCard'
import { useGameStore } from '../../store/gameStore'
import { useCardManagement } from '../../store/hooks/useCardManagement'
import PlayerRooms from './PlayerRooms'
import PlayerControls from './PlayerControls'
import type { Initial } from '../../types/types'

interface PlayerBoardProps {
  player: Player
}

export const PlayerBoard: React.FC<PlayerBoardProps> = ({ 
  player,
}) => {
  // Estado (solo lectura)
  const game = useGameStore((state) => state.game)
  const handRef = useRef<HTMLDivElement>(null)
  
  // Acciones a través del hook
  const { selectCard, deselectCards } = useCardManagement()

  // Obtener allowed_cards y played_cards del jugador actual
  const tablePlay = game.table_plays[player.player_id]
  const allowedCards = tablePlay?.allowed_cards ?? null
  const hasPlayedCards = (tablePlay?.played_cards.length || 0) > 0

  // Función para determinar si una carta debe estar deshabilitada
  const isCardDisabled = (card: typeof player.hand[0]) => {
    const playedCardsCount = tablePlay?.played_cards.length || 0
    
    // Si ya hay 3 cartas jugadas, todas están deshabilitadas
    if (playedCardsCount >= 3) return true
    
    // Si no hay cartas jugadas, todas están habilitadas
    if (!hasPlayedCards) return false
    
    // Las cartas discount siempre están habilitadas (a menos que ya haya 3 cartas)
    if (card.suit === 'discount') return false
    
    // Si allowed_cards es null, todas las cartas están habilitadas (estado comodín)
    if (allowedCards === null) return false
    
    // Si allowed_cards es un array vacío, ninguna carta está habilitada
    if (allowedCards.length === 0) return true
    
    // La carta está habilitada si alguno de sus initials está en allowed_cards
    const hasAllowedInitial = allowedCards.includes(card.first_row as Initial) || 
                               allowedCards.includes(card.second_row as Initial)
    
    return !hasAllowedInitial
  }

  // Manejar click en una carta
  const handleCardClick = (cardId: number) => {
    selectCard(player.player_id, cardId)
  }

  // Manejar click en un EventMarker
  const handleMarkerClick = (cardId: number, initial: string) => {
    selectCard(player.player_id, cardId, [initial as Initial])
  }

  // Manejar inicio de drag
  const handleDragStart = (_cardId: number) => {
    // Opcional: podrías deseleccionar al empezar a arrastrar
    // deselectCards(player.player_id)
  }

  // Manejar click fuera de las cartas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (handRef.current && !handRef.current.contains(event.target as Node)) {
        deselectCards(player.player_id)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [player.player_id, deselectCards])

  return (
    <div className="relative flex-[1.2] w-full bg-transparent">
      <div className="flex flex-row gap-2 h-full items-center justify-center bg-[#697b8f]/40 border border-[#697b8f]/10 rounded-t-md px-8 w-fit mx-auto">
      <PlayerRooms rooms={player.rooms} />
        <div 
          ref={handRef}
          className="flex gap-2 p-4 overflow-x-auto items-center justify-center"
        >
          {player.hand.map((card) => (
            <PlayingCard 
              key={card.id} 
              card={card} 
              height={200}
              onClick={() => handleCardClick(card.id)}
              onMarkerClick={handleMarkerClick}
              draggable={true}
              onDragStart={handleDragStart}
              disabled={isCardDisabled(card)}
            />
          ))}
        </div>
      <PlayerControls player={player} />
      </div>
    </div>
  )
}
