import React from 'react'
import { getImagePath } from '../../utils/utils'
import type { DishCard } from '../../types/types'

interface DishProps {
  dish: DishCard
  height?: number
}

export const Dish: React.FC<DishProps> = ({ 
  dish, 
  height = 200 
}) => {

  return (
    <img
      src={getImagePath('dishes', dish.image_url)}
      alt={dish.name}
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain'
      }}
    />
  )
}
