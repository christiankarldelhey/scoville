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
import discount from '../../assets/simbolos/dinero.png';
import roomCard1 from '../../assets/room-cards/1.png';
import roomCard2 from '../../assets/room-cards/2.png';
import roomCard3 from '../../assets/room-cards/3.png';
import roomCard4 from '../../assets/room-cards/4.png';

interface PlayerRoomsProps {
  rooms: RoomCard[];
}

const SUIT_COLORS: Record<string, string> = {
  'travelers': 'bg-travelers',
  'nobles': 'bg-nobles',
  'locals': 'bg-locals',
};

const PRODUCT_SYMBOLS: Record<string, string> = {
  'cerveza': cerveza,
  'comida': comida,
  'fuego': fuego,
  'juegos': juegos,
  'musica': musica,
  'sofa': sofa,
  'te': te,
  'torta': torta,
  'whisky': whisky,
  'discount': discount,
};

const ROOM_CARD_IMAGES: Record<number, string> = {
  1: roomCard1,
  2: roomCard2,
  3: roomCard3,
  4: roomCard4,
};

const PlayerRooms = ({ rooms }: PlayerRoomsProps) => {
  const sortedRooms = [...rooms].sort((a, b) => a.quality - b.quality);
  const roomsByQuality = [
    sortedRooms.find(r => r.quality === 1),
    sortedRooms.find(r => r.quality === 2),
    sortedRooms.find(r => r.quality === 3),
    sortedRooms.find(r => r.quality === 4),
  ];

  return (
    <div className="w-[200px] h-[200px] grid grid-cols-2 grid-rows-2 gap-0 rounded-md">
      {roomsByQuality.map((room, index) => {
        const position = index + 1;
        const hasGuest = room?.guest?.portrait_url;
        const isEmptyRoom = !hasGuest;

        return (
          <div
            key={position}
            className={`border border-gray-400 flex items-center justify-center bg-gray-100 relative transition-all duration-300 cursor-pointer ${
              isEmptyRoom ? 'grayscale hover:grayscale-0' : ''
            }`}
            style={{
              backgroundImage: isEmptyRoom ? `url(${ROOM_CARD_IMAGES[position]})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {hasGuest && room.guest ? (
              <>
                <img
                  src={`/src/assets/characters-portraits/${room.guest.portrait_url}`}
                  alt={room.guest.name || 'Guest'}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute bottom-0 left-0 w-[30px] h-[30px] ${
                    SUIT_COLORS[room.guest.suit] || 'bg-gray-500'
                  } flex items-center justify-center`}
                >
                  <img
                    src={PRODUCT_SYMBOLS[room.guest.product]}
                    alt={room.guest.product}
                    className="h-4 w-4"
                  />
                </div>
                <div
                  className={`absolute top-0 right-0 w-[30px] h-[30px] ${
                    SUIT_COLORS[room.guest.suit] || 'bg-gray-500'
                  } flex items-end justify-end p-0.5`}
                >
                  <span className="text-white text-[8px] font-bold">
                    {room.guest.used_nights}/{room.guest.total_nights}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerRooms;