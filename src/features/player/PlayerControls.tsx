import { RoomCard } from '../../types/types';
import cerveza from '../../assets/simbolos/cerveza.png';
import comida from '../../assets/simbolos/comida.png';
import fuego from '../../assets/simbolos/fuego.png';
import juegos from '../../assets/simbolos/juego.png';
import musica from '../../assets/simbolos/musica.png';
import sofa from '../../assets/simbolos/sofa.png';
import te from '../../assets/simbolos/te.png';
import torta from '../../assets/simbolos/torta.png';
import whisky from '../../assets/simbolos/whisky.png';

interface PlayerControlsProps {
  rooms: RoomCard[];
}

const PlayerControls = ({ rooms }: PlayerControlsProps) => {
  // Ordenar rooms por quality
  const sortedRooms = [...rooms].sort((a, b) => a.quality - b.quality);

  // Separar por filas según quality
  const topRow = sortedRooms.filter(room => room.quality === 1 || room.quality === 2);
  const bottomRow = sortedRooms.filter(room => room.quality === 3 || room.quality === 4);

  const renderRoomSlot = (room: RoomCard | undefined) => {
    const getSuitColor = (suit: string) => {
      const suitColors: Record<string, string> = {
        'travelers': 'bg-travelers',
        'nobles': 'bg-nobles',
        'locals': 'bg-locals',
      };
      return suitColors[suit] || 'bg-gray-500';
    };

    const getProductSymbol = (product: string) => {
      const productSymbols: Record<string, string> = {
        'cerveza': cerveza,
        'comida': comida,
        'fuego': fuego,
        'juegos': juegos,
        'musica': musica,
        'sofa': sofa,
        'te': te,
        'torta': torta,
        'whisky': whisky,
      };
      return productSymbols[product] || '';
    };

    return (
      <div className="border border-gray-400 flex items-center justify-center bg-gray-100 relative">
        {room?.guest?.portrait_url ? (
          <>
            <img
              src={`/src/assets/characters-portraits/${room.guest.portrait_url}`}
              alt={room.guest.name || 'Guest'}
              className="w-full h-full object-cover"
            />
            {room.guest && (
              <>
                {/* Cuarto de círculo inferior izquierdo - Símbolo */}
                <div 
                  className={`absolute bottom-0 left-0 w-[25px] h-[25px] ${getSuitColor(room.guest.suit)} rounded-tr-full flex items-start justify-start p-0.5`}
                >
                  <img src={getProductSymbol(room.guest.value)} alt={room.guest.value} className="h-4 w-4" />
                </div>
                
                {/* Cuarto de círculo superior derecho - Nights */}
                <div 
                  className={`absolute top-0 right-0 w-[25px] h-[25px] ${getSuitColor(room.guest.suit)} rounded-bl-full flex items-end justify-end p-0.5`}
                >
                  <span className="text-white text-[8px] font-bold">{room.guest.used_nights}/{room.guest.total_nights}</span>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-gray-400 text-xs">Empty</div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[180px] h-[180px] grid grid-cols-2 grid-rows-2 gap-0">
      {/* Top Row - Quality 1 & 2 */}
      {renderRoomSlot(topRow[0])}
      {renderRoomSlot(topRow[1])}
      
      {/* Bottom Row - Quality 3 & 4 */}
      {renderRoomSlot(bottomRow[0])}
      {renderRoomSlot(bottomRow[1])}
    </div>
  );
};

export default PlayerControls;