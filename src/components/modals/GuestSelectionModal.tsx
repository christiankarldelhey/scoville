import { GuestCard } from '../common/GuestCard'
import type { GuestCard as GuestType } from '../../types/types'

interface GuestSelectionModalProps {
  guests: GuestType[]
  onSelect: (guest: GuestType) => void
  onClose: () => void
}

/**
 * Modal para que el jugador seleccione un invitado durante la fase de guest_selection
 */
export const GuestSelectionModal = ({ 
  guests,
  onSelect,
  onClose 
}: GuestSelectionModalProps) => {
  if (!guests || guests.length === 0) return null

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
            Elige uno de los siguientes invitados para añadir a tu mano
          </p>
        </div>

        {/* Mostrar las 3 cartas de guest */}
        <div className="flex justify-center items-center gap-6 mb-6">
          {guests.map((guest, index) => (
            <div 
              key={index}
              className="cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
              onClick={() => onSelect(guest)}
            >
              <GuestCard guest={guest} height={230} />
            </div>
          ))}
        </div>

        {/* Botón cancelar */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
