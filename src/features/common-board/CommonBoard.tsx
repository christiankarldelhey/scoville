import React from 'react'
import PlayerScore from '../player/PlayerScore'
import { OtherPlayerHand } from './OtherPlayerHand'
import EventScore from '../player/EventScore'
import { useGameStore } from '../../store/gameStore'
import { PlayZone } from './PlayZone'

export const CommonBoard = () => {
  const { players } = useGameStore()
  
  return (
    <div className="relative flex-[3] w-full bg-transparent flex items-center justify-center">
      <OtherPlayerHand cardCount={players.player_2.hand.length || 0} position="top" />
      <OtherPlayerHand cardCount={players.player_3.hand.length || 0} position="left" />
      <OtherPlayerHand cardCount={players.player_4.hand.length || 0} position="right" />
      <PlayZone 
        topPlayer={{ playerId: 'player_1', cards: [] }}
        bottomPlayer={{ playerId: 'player_2', cards: [] }}
        leftPlayer={{ playerId: 'player_3', cards: [] }}
        rightPlayer={{ playerId: 'player_4', cards: [] }}
      />
      <PlayerScore guests={players.player_1.score.former_guests} />
      <EventScore events={players.player_1.score.events} />
    </div>
  )
}
