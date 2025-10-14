import React from 'react'
import cardBack from '../../assets/reverse.jpg'
import rotatedCardBack from '../../assets/reverse-rotated.jpg'

interface OtherPlayerHandProps {
  cardCount: number
  position: 'top' | 'left' | 'right'
}

export const OtherPlayerHand: React.FC<OtherPlayerHandProps> = ({ cardCount, position }) => {
  const containerClasses = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-[80%] flex-row',
    left: 'left-0 top-60 -translate-x-[80%] flex-col',
    right: 'right-0 top-60 translate-x-[80%] flex-col'
  }

  const cardImage = position === 'top' ? cardBack : rotatedCardBack

  return (
    <div className={`absolute z-[15] flex gap-1 ${containerClasses[position]}`}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <img
          key={index}
          src={cardImage}
          alt="card back"
          className={` object-contain ${position === 'top' ? 'w-[50px] h-auto' : 'w-auto h-[50px]'}`}
        />
      ))}
    </div>
  )
}
