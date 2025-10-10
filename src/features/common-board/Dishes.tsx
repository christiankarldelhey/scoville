import React from 'react'
import { Dish } from '../../components/common/Dish'
import dishesData from '../../data/dishes.json'
import type { DishCard } from '../../types/types'
import styles from './Dishes.module.css'

export const Dishes = () => {
  const dishes = dishesData as DishCard[]

  return (
    <div className={styles.container}>  
        <Dish dish={dishes[0]} height={280} />
        <Dish dish={dishes[18]} height={280} />
    </div>

  )
}
