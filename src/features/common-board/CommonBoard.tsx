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
  
  return (
    <div className="relative flex-[3] w-full bg-transparent flex items-center justify-center">
      <OtherPlayerHand cardCount={players.player_2.hand.length || 0} position="top" />
      <OtherPlayerHand cardCount={players.player_3.hand.length || 0} position="left" />
      <OtherPlayerHand cardCount={players.player_4.hand.length || 0} position="right" />
      <PlayZone 
        topPlayer={{ playerId: 'player_2', cards: game.table_plays.player_2 || [] }}
        bottomPlayer={{ playerId: 'player_1', cards: game.table_plays.player_1 || [] }}
        leftPlayer={{ playerId: 'player_3', cards: game.table_plays.player_3 || [] }}
        rightPlayer={{ playerId: 'player_4', cards: game.table_plays.player_4 || [] }}
        onCardDrop={handleCardDrop}
      />
      <PlayerScore Myscore={players.player_1.score} />
      <EventScore events={players.player_1.score.events} />
    </div>
  )
}
