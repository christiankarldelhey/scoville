import React from 'react'
import { Guests } from './Guests'
import { PlayerDropZone } from './PlayerDropZone'
import type { PlayingCard } from '../../types/types'

interface PlayerPlayArea {
  playerId: string
  cards: PlayingCard[]
}

interface PlayZoneProps {
  topPlayer?: PlayerPlayArea
  bottomPlayer?: PlayerPlayArea
  leftPlayer?: PlayerPlayArea
  rightPlayer?: PlayerPlayArea
  onCardDrop?: (playerId: string, cardId: number) => void
}

export const PlayZone: React.FC<PlayZoneProps> = ({
  topPlayer,
  bottomPlayer,
  leftPlayer,
  rightPlayer,
  onCardDrop
}) => {
  return (
    <div className="relative w-[80%] h-[80%] min-h-[600px] flex items-center justify-center">
      <PlayerDropZone
        playerId={topPlayer?.playerId}
        cards={[
          {
        "id": 21,
        "first_row": "R",
        "second_row": "A",
        "value": "fuego",
        "suit": "viajero",
        "image_url": "v-fuego-RA.png",
        "state": "in_deck",
        "owner": null
    },
    {
        "id": 22,
        "first_row": "J",
        "second_row": "F",
        "value": "juegos",
        "suit": "viajero",
        "image_url": "v-juegos-JF.png",
        "state": "in_deck",
        "owner": null
    },
    {
        "id": 23,
        "first_row": "R",
        "second_row": "F",
        "value": "musica",
        "suit": "viajero",
        "image_url": "v-musica-RF.png",
        "state": "in_deck",
        "owner": null
    },
    {
        "id": 24,
        "first_row": "J",
        "second_row": "T",
        "value": "sofa",
        "suit": "viajero",
        "image_url": "v-sofa-JT.png",
        "state": "in_deck",
        "owner": null
    }
        ]}
        position="top"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={bottomPlayer?.playerId}
        cards={bottomPlayer?.cards || []}
        position="bottom"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={leftPlayer?.playerId}
        cards={[
          {
        "id": 18,
        "first_row": "C",
        "second_row": "F",
        "value": "whisky",
        "suit": "noble",
        "image_url": "n-whisky-CF.png",
        "state": "in_deck",
        "owner": null
    },
    {
        "id": 19,
        "first_row": "J",
        "second_row": "A",
        "value": "cerveza",
        "suit": "viajero",
        "image_url": "v-cerveza-JA.png",
        "state": "in_deck",
        "owner": null
    },
    {
        "id": 20,
        "first_row": "C",
        "second_row": "A",
        "value": "comida",
        "suit": "viajero",
        "image_url": "v-comida-CA.png",
        "state": "in_deck",
        "owner": null
    }
        ]}
        position="left"
        onCardDrop={onCardDrop}
      />
      
      <PlayerDropZone
        playerId={rightPlayer?.playerId}
        cards={rightPlayer?.cards || []}
        position="right"
        onCardDrop={onCardDrop}
      />
      
      <div className="z-10">
        <Guests />
      </div>
    </div>
  )
}
