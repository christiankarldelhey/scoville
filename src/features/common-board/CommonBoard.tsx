import React from 'react'
import { Dish } from '../../components/common/Dish'
import dishesData from '../../data/dishes.json'
import type { DishCard } from '../../types/types'
import styles from './CommonBoard.module.css'

export const CommonBoard = () => {
  const dishes = dishesData as DishCard[]
  
  return (
    <div className={styles.container}>
      <Dish dish={dishes[0]} height={280} />
      <Dish dish={dishes[14]} height={280} />
    </div>
  )
}
