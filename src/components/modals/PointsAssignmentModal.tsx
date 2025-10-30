import { useState } from 'react'
import type { PlayerId } from '../../types/types'
import { useCheckoutAndDeal } from '../../store/useCheckoutAndDeal'

interface PointsAssignmentModalProps {
  playerId: PlayerId
  totalPoints: number
  onClose: () => void
}

/**
 * Modal para que el jugador asigne sus puntos entre score y cartas adicionales
 */
export const PointsAssignmentModal = ({ 
  playerId, 
  totalPoints, 
  onClose 
}: PointsAssignmentModalProps) => {
  const [pointsToScore, setPointsToScore] = useState(totalPoints)
  const [pointsToCards, setPointsToCards] = useState(0)
  const { assignPoints } = useCheckoutAndDeal()

  const handleScoreChange = (value: number) => {
    const newPointsToScore = Math.max(0, Math.min(totalPoints, value))
    setPointsToScore(newPointsToScore)
    setPointsToCards(totalPoints - newPointsToScore)
  }

  const handleCardsChange = (value: number) => {
    const newPointsToCards = Math.max(0, Math.min(totalPoints, value))
    setPointsToCards(newPointsToCards)
    setPointsToScore(totalPoints - newPointsToCards)
  }

  const handleConfirm = () => {
    assignPoints(playerId, pointsToScore, pointsToCards)
    onClose()
  }

  if (totalPoints === 0) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Asignar Puntos</h2>
        
        <p className="text-gray-600 mb-6">
          Has recibido <span className="font-bold text-blue-600">{totalPoints}</span> punto{totalPoints !== 1 ? 's' : ''} 
          por tus huéspedes. Decide cómo distribuirlos:
        </p>

        <div className="space-y-4 mb-6">
          {/* Puntos a Score */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puntos al Score
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={totalPoints}
                value={pointsToScore}
                onChange={(e) => handleScoreChange(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max={totalPoints}
                value={pointsToScore}
                onChange={(e) => handleScoreChange(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center"
              />
            </div>
          </div>

          {/* Puntos a Cartas */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puntos a Cartas Adicionales
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={totalPoints}
                value={pointsToCards}
                onChange={(e) => handleCardsChange(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max={totalPoints}
                value={pointsToCards}
                onChange={(e) => handleCardsChange(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center"
              />
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Score directo:</span>
            <span className="font-bold text-green-600">+{pointsToScore}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cartas adicionales:</span>
            <span className="font-bold text-blue-600">+{pointsToCards}</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
