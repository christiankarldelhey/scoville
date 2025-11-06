import { useState } from 'react'
import { GuestCard } from '../common/GuestCard'
import type { GuestCard as GuestType } from '../../types/types'

interface GuestSelectionModalProps {
  guests: GuestType[]
  onSelect: (guest: GuestType) => void
  onClose: () => void
  onConfirm?: (playThisRound: GuestType, playNextRound: GuestType, returnToDeck: GuestType) => void
}

/**
 * Modal para que el jugador seleccione un invitado durante la fase de guest_selection
 */
export const GuestSelectionModal = ({ 
  guests,
  onSelect,
  onClose,
  onConfirm
}: GuestSelectionModalProps) => {
  if (!guests || guests.length === 0) return null

  // Estado para rastrear qué carta está en qué slot
  const [draggedCard, setDraggedCard] = useState<{ guest: GuestType; from: string } | null>(null)
  const [slotCards, setSlotCards] = useState<{
    playThisRound: GuestType | null
    playNextRound: GuestType | null
    returnToDeck: GuestType | null
  }>({
    playThisRound: null,
    playNextRound: null,
    returnToDeck: null
  })

  // Handlers para drag
  const handleDragStart = (guest: GuestType, from: string) => {
    setDraggedCard({ guest, from })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (slot: 'playThisRound' | 'playNextRound' | 'returnToDeck') => {
    if (!draggedCard) return

    // Si viene de un slot, liberar ese slot
    if (draggedCard.from !== 'original') {
      setSlotCards(prev => ({
        ...prev,
        [draggedCard.from]: null
      }))
    }

    // Colocar en el nuevo slot
    setSlotCards(prev => ({
      ...prev,
      [slot]: draggedCard.guest
    }))

    setDraggedCard(null)
  }

  const handleDropToOriginal = (guestId: string) => {
    if (!draggedCard) return

    // Solo permitir si la carta viene de un slot
    if (draggedCard.from !== 'original') {
      setSlotCards(prev => ({
        ...prev,
        [draggedCard.from]: null
      }))
    }

    setDraggedCard(null)
  }

  // Verificar si una carta está en algún slot
  const isCardInSlot = (guest: GuestType) => {
    return Object.values(slotCards).some(card => card?.id === guest.id)
  }

  // Verificar si todas las cartas están en slots
  const allCardsInSlots = () => {
    return slotCards.playThisRound !== null && 
           slotCards.playNextRound !== null && 
           slotCards.returnToDeck !== null
  }

  // Manejar confirmación
  const handleConfirm = () => {
    if (!allCardsInSlots()) return
    
    if (onConfirm && slotCards.playThisRound && slotCards.playNextRound && slotCards.returnToDeck) {
      onConfirm(slotCards.playThisRound, slotCards.playNextRound, slotCards.returnToDeck)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg p-6 max-w-4xl w-full shadow-xl"
        style={{ fontFamily: '"Old Standard TT", serif' }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: '"Old Standard TT", serif' }}>
          Selecciona un Invitado
        </h2>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-gray-700 text-center text-sm">
            Ordena los huéspedes.
          </p>
        </div>

        {/* Mostrar las 3 cartas de guest */}
        <div className="flex justify-center items-center gap-6 mb-6">
          {guests.map((guest, index) => (
            <div 
              key={index}
              className={`transition-transform hover:scale-105 hover:shadow-lg ${
                isCardInSlot(guest) ? 'opacity-30' : 'cursor-grab active:cursor-grabbing'
              }`}
              draggable={!isCardInSlot(guest)}
              onDragStart={() => handleDragStart(guest, 'original')}
              onDragOver={handleDragOver}
              onDrop={() => handleDropToOriginal(guest.id)}
            >
              <GuestCard guest={guest} height={230} />
            </div>
          ))}
        </div>

        {/* Slots de drag and drop */}
        <div className="flex justify-center items-start gap-4 mb-6">
          {/* Slot 1: Jugar esta ronda */}
          <div
            className="flex flex-col items-center"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('playThisRound')}
          >
            <div className="w-[160px] h-[230px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-green-50 hover:bg-green-100 transition-colors">
              {slotCards.playThisRound ? (
                <div
                  draggable
                  onDragStart={() => handleDragStart(slotCards.playThisRound!, 'playThisRound')}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <GuestCard guest={slotCards.playThisRound} height={230} />
                </div>
              ) : (
                <p className="text-gray-400 text-center text-sm px-2">Arrastra aquí</p>
              )}
            </div>
            <p className="text-xs text-center mt-2 font-semibold text-gray-700">Carta para jugar<br/>en esta ronda</p>
          </div>

          {/* Slot 2: Jugar próxima ronda */}
          <div
            className="flex flex-col items-center"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('playNextRound')}
          >
            <div className="w-[160px] h-[230px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-yellow-50 hover:bg-yellow-100 transition-colors">
              {slotCards.playNextRound ? (
                <div
                  draggable
                  onDragStart={() => handleDragStart(slotCards.playNextRound!, 'playNextRound')}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <GuestCard guest={slotCards.playNextRound} height={230} />
                </div>
              ) : (
                <p className="text-gray-400 text-center text-sm px-2">Arrastra aquí</p>
              )}
            </div>
            <p className="text-xs text-center mt-2 font-semibold text-gray-700">Carta para jugar<br/>la próxima ronda</p>
          </div>

          {/* Slot 3: Devolver al mazo */}
          <div
            className="flex flex-col items-center"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('returnToDeck')}
          >
            <div className="w-[160px] h-[230px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 transition-colors">
              {slotCards.returnToDeck ? (
                <div
                  draggable
                  onDragStart={() => handleDragStart(slotCards.returnToDeck!, 'returnToDeck')}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <GuestCard guest={slotCards.returnToDeck} height={230} />
                </div>
              ) : (
                <p className="text-gray-400 text-center text-sm px-2">Arrastra aquí</p>
              )}
            </div>
            <p className="text-xs text-center mt-2 font-semibold text-gray-700">Carta que vuelve<br/>al mazo</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!allCardsInSlots()}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              allCardsInSlots()
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirmar Selección
          </button>
        </div>
      </div>
    </div>
  )
}
