import React from 'react'
import cardBack from '../../assets/reverse.jpg'

interface OtherPlayerHandProps {
  cardCount: number
  position: 'top' | 'left' | 'right'
}

export const OtherPlayerHand: React.FC<OtherPlayerHandProps> = ({ cardCount, position }) => {
  const containerClasses = {
    top: 'top-[10px] left-1/2 -translate-x-1/2 flex-row gap-[-15px]',
    left: 'left-[10px] top-1/2 -translate-y-1/2 flex-col gap-[-15px]',
    right: 'right-[10px] top-1/2 -translate-y-1/2 flex-col gap-[-15px]'
  }

  const cardClasses = {
    top: 'rotate-0',
    left: 'rotate-90',
    right: '-rotate-90'
  }

  return (
    <div className={`absolute flex z-[15] p-4 ${containerClasses[position]}`}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <img
          key={index}
          src={cardBack}
          alt="card back"
          className={`h-[50px] w-auto object-contain -m-[10px] ${cardClasses[position]}`}
        />
      ))}
    </div>
  )
}
