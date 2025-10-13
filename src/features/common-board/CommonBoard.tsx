import React from 'react'
import { Guests } from './Guests'
import { OtherPlayerHand } from './OtherPlayerHand'

export const CommonBoard = () => {
  
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-transparent z-10 flex items-center justify-between px-8">
      <OtherPlayerHand cardCount={6} position="top" />
      <OtherPlayerHand cardCount={6} position="left" />
      <OtherPlayerHand cardCount={6} position="right" />
      <Guests />
    </div>
  )
}
