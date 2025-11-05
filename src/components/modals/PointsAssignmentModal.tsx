import { useState } from 'react'
import type { PlayerId } from '../../types/types'
import { useCheckoutAndDeal } from '../../store/hooks/useCheckoutAndDeal'
import { useGameStore } from '../../store/gameStore'
import { useTurnManagement } from '../../store/hooks/useTurnManagement'
import { useGame } from '../../store/hooks/useGame'
import { GuestCard } from '../common/GuestCard'
import puntaje from '../../assets/simbolos/puntaje.png'
import reverse from '../../assets/reverse.png'
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
  // Estado: Set de IDs de habitaciones toggleadas (punto a carta en vez de score)
  const [toggledRooms, setToggledRooms] = useState<Set<number>>(new Set())
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

  // Calcular puntos basado en habitaciones toggleadas
  const emptyRoomsCount = roomsByQuality.filter(room => !room?.guest).length
  const cardsNextRound = emptyRoomsCount + toggledRooms.size
  const pointsToScore = totalPoints - toggledRooms.size

  const handleRoomToggle = (roomId: number) => {
    setToggledRooms(prev => {
      const newSet = new Set(prev)
      if (newSet.has(roomId)) {
        newSet.delete(roomId)
      } else {
        newSet.add(roomId)
      }
      return newSet
    })
  }

  const handleConfirm = () => {
    
    // 1. Asignar puntos
    assignPoints(playerId, pointsToScore, toggledRooms.size)
    
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
          Checkout
        </h2>
        
        
        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-gray-700 text-center text-sm">
            Ha pasado una nueva noche, y has recibido {totalPoints} puntos de tus huespedes. <br /> 
            Clickea en una habitacion con el simbolo de <img src={puntaje} alt="puntaje" className="w-4 h-4 text-black" /> para convertir un punto en una carta adicional en la proxima ronda.
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
                  className={`w-[100px] h-[100px] border-2 flex items-center justify-center bg-gray-100 relative transition-all ${
                    isEmptyRoom ? 'grayscale border-gray-400' : 'border-white shadow-lg animate-pulse-border'
                  }`}
                  style={{
                    backgroundImage: isEmptyRoom ? `url(/src/assets/room-cards/${room?.image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Room 
                    guest={room?.guest} 
                    isPointAssignment={true}
                    isToggled={room ? toggledRooms.has(room.id) : false}
                    onClick={room?.guest ? () => handleRoomToggle(room.id) : undefined}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Layout horizontal: Score | Guest | Cartas */}
        <div className="flex items-center justify-between gap-6 mb-6">
          {/* Columna izquierda - Puntos al Score */}
          <div className="flex-1 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-700 mb-2 text-center">Puntos al Score</p>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <img
                src={puntaje}
                alt="Score"
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) saturate(100%)' }}
              />
              <span className="absolute text-black text-3xl font-bold">
                {pointsToScore}
              </span>
            </div>
          </div>

          {/* Columna central - Guest Card */}
          <div className="flex-shrink-0">
            {completedGuests.length > 0 && (
              <GuestCard guest={completedGuests[0]} height={200} />
            )}
          </div>

          {/* Columna derecha - Cartas Próxima Ronda */}
          <div className="flex-1 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-700 mb-2 text-center">Cartas Próxima Ronda</p>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <img
                src={reverse}
                alt="Cards"
                className="w-full h-full object-contain"
              />
              <span className="absolute text-gray-800 text-3xl font-bold">
                {cardsNextRound}
              </span>
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
