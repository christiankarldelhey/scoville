import type { RoomCard } from '../../types/types';
import Room from '../../components/common/Room';

interface PlayerRoomsProps {
  rooms: RoomCard[];
}


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
              backgroundImage: isEmptyRoom ? `url(/src/assets/room-cards/${room?.image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {hasGuest && room.guest ? (
              <Room guest={room.guest} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerRooms;