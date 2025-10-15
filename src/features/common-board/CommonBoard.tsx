import React from 'react'
import { Guests } from './Guests'
import PlayerScore from '../player/PlayerScore'
import { OtherPlayerHand } from './OtherPlayerHand'
import EventScore from '../player/EventScore'
import PlayerScoreExample from '../../data/player-score-example.json'
import { PlayZone } from './PlayZone'

export const CommonBoard = () => {
  
  return (
    <div className="relative flex-[3] w-full bg-transparent flex items-center justify-center">
      <OtherPlayerHand cardCount={6} position="top" />
      <OtherPlayerHand cardCount={6} position="left" />
      <OtherPlayerHand cardCount={6} position="right" />
      <PlayZone 
        topPlayer={{ playerId: 'player_1', cards: [] }}
        bottomPlayer={{ playerId: 'player_2', cards: [] }}
        leftPlayer={{ playerId: 'player_3', cards: [] }}
        rightPlayer={{ playerId: 'player_4', cards: [] }}
      />
      {/* <div className="flex items-center justify-center w-full px-8">
        <Guests />
      </div> */}
      <PlayerScore guests={PlayerScoreExample[0].former_guests} />
      <EventScore events={PlayerScoreExample[0].events} />
    </div>
  )
}
