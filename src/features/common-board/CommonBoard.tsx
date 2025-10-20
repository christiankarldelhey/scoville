import PlayerScore from '../player/PlayerScore'
import { OtherPlayerHand } from './OtherPlayerHand'
import EventScore from '../player/EventScore'
import { useGameStore } from '../../store/gameStore'
import { PlayZone } from './PlayZone'

export const CommonBoard = () => {
  const { players, game, playCard } = useGameStore()
  
  const handleCardDrop = (playerId: string, cardId: number) => {
    playCard(playerId as any, cardId)
  }
  
  // Calcular las posiciones de los jugadores basándose en player_turn
  // El jugador con el turno siempre es bottom, los demás rotan en sentido horario
  const currentTurnIndex = game.active_players.indexOf(game.player_turn)
  
  // Rotación: bottom -> left -> top -> right -> bottom
  const bottomPlayerId = game.active_players[currentTurnIndex]
  const leftPlayerId = game.active_players[(currentTurnIndex + 1) % game.active_players.length]
  const topPlayerId = game.active_players[(currentTurnIndex + 2) % game.active_players.length]
  const rightPlayerId = game.active_players[(currentTurnIndex + 3) % game.active_players.length]
  
  return (
    <div className="relative flex-[3] w-full bg-transparent flex items-center justify-center">
      <OtherPlayerHand cardCount={players[topPlayerId].hand.length || 0} position="top" />
      <OtherPlayerHand cardCount={players[leftPlayerId].hand.length || 0} position="left" />
      <OtherPlayerHand cardCount={players[rightPlayerId].hand.length || 0} position="right" />
      <PlayZone 
        topPlayer={{ 
          playerId: topPlayerId, 
          cards: game.table_plays[topPlayerId]?.played_cards || [],
          allowedCards: game.table_plays[topPlayerId]?.allowed_cards || [],
          meldScore: game.table_plays[topPlayerId]?.meld_score || 0
        }}
        bottomPlayer={{ 
          playerId: bottomPlayerId, 
          cards: game.table_plays[bottomPlayerId]?.played_cards || [],
          allowedCards: game.table_plays[bottomPlayerId]?.allowed_cards || [],
          meldScore: game.table_plays[bottomPlayerId]?.meld_score || 0
        }}
        leftPlayer={{ 
          playerId: leftPlayerId, 
          cards: game.table_plays[leftPlayerId]?.played_cards || [],
          allowedCards: game.table_plays[leftPlayerId]?.allowed_cards || [],
          meldScore: game.table_plays[leftPlayerId]?.meld_score || 0
        }}
        rightPlayer={{ 
          playerId: rightPlayerId, 
          cards: game.table_plays[rightPlayerId]?.played_cards || [],
          allowedCards: game.table_plays[rightPlayerId]?.allowed_cards || [],
          meldScore: game.table_plays[rightPlayerId]?.meld_score || 0
        }}
        onCardDrop={handleCardDrop}
      />
      <PlayerScore Myscore={players[bottomPlayerId].score} />
      <EventScore events={players[bottomPlayerId].score.events} />
    </div>
  )
}
