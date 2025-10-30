/**
 * DEPRECATED: Este archivo se mantiene por compatibilidad.
 * Usa los hooks desde './hooks/' directamente.
 * 
 * Los hooks ahora están organizados por fases del juego:
 * - useGame: Orquestador principal
 * - useGamePreparation: Fase de preparación
 * - useCheckoutAndDeal: Fase de checkout
 * - useGuestSelection: Fase de selección de guests
 * - useRoomBid: Fase de puja por habitaciones
 * - useGuestBids: Fases de puja por guests
 * - useScoring: Fase de puntuación
 * - useCardManagement: Gestión de cartas (transversal)
 * - useTurnManagement: Gestión de turnos (transversal)
 */

// Re-exportar todos los hooks desde la nueva estructura
export * from './hooks'
