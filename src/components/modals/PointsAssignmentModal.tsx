import { useState } from 'react'
import type { PlayerId } from '../../types/types'
import { useCheckoutAndDeal } from '../../store/hooks/useCheckoutAndDeal'
import { useGameStore } from '../../store/gameStore'
import { useTurnManagement } from '../../store/hooks/useTurnManagement'
import { useGame } from '../../store/hooks/useGame'
import { GuestCard } from '../common/GuestCard'
import Room from '../common/Room'

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
  const { nextTurn } = useTurnManagement()
  const { setPlayerReady } = useGame()
  
  // Obtener los guests completados del jugador
  const player = useGameStore((state) => state.players[playerId])
  const completedGuests = player.score.former_guests.slice(-totalPoints) // Últimos guests completados
  
  // Obtener y ordenar las habitaciones del jugador
  const sortedRooms = [...player.rooms].sort((a, b) => a.quality - b.quality)
  const roomsByQuality = [
    sortedRooms.find(r => r.quality === 1),
    sortedRooms.find(r => r.quality === 2),
    sortedRooms.find(r => r.quality === 3),
    sortedRooms.find(r => r.quality === 4),
  ]

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
    
    // 1. Asignar puntos
    assignPoints(playerId, pointsToScore, pointsToCards)
    
    // 2. Marcar jugador como listo
    setPlayerReady(playerId, true)
    
    // 3. Cerrar modal
    onClose()
    
    // 4. Pasar al siguiente turno
    console.log('🔄 Pasando al siguiente turno...')
    nextTurn()
  }

  if (totalPoints === 0) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl"
        style={{ fontFamily: '"Old Standard TT", serif' }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center" style={{ fontFamily: '"Old Standard TT", serif' }}>
          Checkout Completado
        </h2>
        
        
        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-gray-700 text-center text-sm">
            Has recibido <span className="font-bold text-blue-600 text-xl">{totalPoints}</span> punto{totalPoints !== 1 ? 's' : ''}. Decide cómo distribuirlos:
          </p>
        </div>

        {/* Habitaciones del jugador */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2 text-center">Tus Habitaciones</p>
          <div className="flex gap-0 justify-center">
            {roomsByQuality.map((room, index) => {
              const position = index + 1
              const hasGuest = room?.guest?.portrait_url
              const isEmptyRoom = !hasGuest

              return (
                <div
                  key={position}
                  className={`w-[100px] h-[100px] border border-gray-400 flex items-center justify-center bg-gray-100 relative ${
                    isEmptyRoom ? 'grayscale' : ''
                  }`}
                  style={{
                    backgroundImage: isEmptyRoom ? `url(/src/assets/room-cards/${room?.image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {hasGuest && room.guest ? (
                    <Room guest={room.guest} />
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        {/* Layout horizontal: Score | Guest | Cartas */}
        <div className="flex items-center justify-between gap-6 mb-6">
          {/* Columna izquierda - Puntos al Score */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-center mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Puntos al Score</p>
              <div className="text-4xl font-bold text-green-600">{pointsToScore}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleScoreChange(pointsToScore - 1)}
                disabled={pointsToScore === 0}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-colors"
              >
                −
              </button>
              <button
                onClick={() => handleScoreChange(pointsToScore + 1)}
                disabled={pointsToScore === totalPoints}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Columna central - Guest Card */}
          <div className="flex-shrink-0">
            {completedGuests.length > 0 && (
              <GuestCard guest={completedGuests[0]} height={200} />
            )}
          </div>

          {/* Columna derecha - Cartas Adicionales */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-center mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Cartas Adicionales</p>
              <div className="text-4xl font-bold text-blue-600">{pointsToCards}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCardsChange(pointsToCards - 1)}
                disabled={pointsToCards === 0}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-colors"
              >
                −
              </button>
              <button
                onClick={() => handleCardsChange(pointsToCards + 1)}
                disabled={pointsToCards === totalPoints}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-colors"
              >
                +
              </button>
            </div>
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
