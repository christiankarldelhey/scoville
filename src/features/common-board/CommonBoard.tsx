import React from 'react'
import { Guests } from './Guests'
import PlayerScore from '../player/PlayerScore'
import { OtherPlayerHand } from './OtherPlayerHand'
import EventScore from '../player/EventScore'
import PlayerScoreExample from '../../data/player-score-example.json'

export const CommonBoard = () => {
  
  return (
    <div className="relative flex-[3] w-full bg-transparent flex items-center justify-center">
      <OtherPlayerHand cardCount={6} position="top" />
      <OtherPlayerHand cardCount={6} position="left" />
      <OtherPlayerHand cardCount={6} position="right" />
      <div className="flex items-center justify-center w-full px-8">
        <Guests />
      </div>
      <PlayerScore guests={PlayerScoreExample[0].former_guests} />
      <EventScore events={PlayerScoreExample[0].events} />
    </div>
  )
}
