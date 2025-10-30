import React, { useMemo } from 'react'
import type { Player } from '../../types/types'
import { useGameStore } from '../../store/gameStore'
import { useCardManagement } from '../../store/hooks/useCardManagement'
import { useTurnManagement } from '../../store/hooks/useTurnManagement'
import playBtnImg from '../../assets/game-controls/play_btn.png'
import passBtnImg from '../../assets/game-controls/pass_btn.png'

interface PlayerControlsProps {
  player: Player
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  player,
}) => {
  // Estado (solo lectura)
  const tablePlays = useGameStore((state) => state.game.table_plays)
  
  // Acciones a través de hooks
  const { confirmTableCards, returnUnconfirmedCards } = useCardManagement()
  const { nextTurn } = useTurnManagement()
  
  // Calcular si el botón de play debe estar disabled 
  const isPlayButtonDisabled = useMemo(() => {
    const currentTablePlay = tablePlays[player.player_id]
    const currentPlayedCardsCount = currentTablePlay?.played_cards.length || 0
    const currentMeldScore = currentTablePlay?.meld_score || 0
    
    // Obtener el máximo de played_cards y meld_score de todos los OTROS jugadores (excluyendo al actual)
    let maxPlayedCards = 0
    let maxMeldScore = 0
    
    Object.entries(tablePlays).forEach(([playerId, tablePlay]) => {
      // Excluir al jugador actual de la comparación
      if (playerId !== player.player_id && tablePlay) {
        const playedCardsCount = tablePlay.played_cards.length
        const meldScore = tablePlay.meld_score
        
        if (playedCardsCount > maxPlayedCards) {
          maxPlayedCards = playedCardsCount
        }
        if (meldScore > maxMeldScore) {
          maxMeldScore = meldScore
        }
      }
    })
    
    // Disabled si played_cards es 0 o menor que el máximo de otros jugadores
    if (currentPlayedCardsCount === 0 || currentPlayedCardsCount < maxPlayedCards) {
      return true
    }
    
    // Disabled si meld_score es menor o igual al máximo de otros jugadores
    if (currentMeldScore <= maxMeldScore) {
      return true
    }
    
    return false
  }, [tablePlays, player.player_id])

  const handlePlayButtonClick = () => {
    confirmTableCards(player.player_id)
    nextTurn()
  }

  const handlePassButtonClick = () => {
    returnUnconfirmedCards(player.player_id)
    nextTurn()
  }

  return (
    <div className="flex flex-col gap-4 h-[200px] justify-center">
      <button 
        onClick={handlePlayButtonClick}
        disabled={isPlayButtonDisabled}
        className="w-[90px] h-[90px] transition-all grayscale hover:grayscale-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:grayscale"
      >
        <img src={playBtnImg} alt="Aceptar" className="w-full h-full object-contain rounded-md" />
      </button>
      <button 
        onClick={handlePassButtonClick}
        className="w-[90px] h-[90px] transition-all grayscale hover:grayscale-0 rounded-md"
      >
        <img src={passBtnImg} alt="Pasar" className="w-full h-full object-contain rounded-md" />
      </button>
    </div>
  )
}

export default PlayerControls