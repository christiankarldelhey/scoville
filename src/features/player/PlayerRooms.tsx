import type { RoomCard, RoundPhase } from '../../types/types';
import Room from '../../components/common/Room';

interface PlayerRoomsProps {
  rooms: RoomCard[];
  onRoomClick?: (roomId: number) => void;
  roundPhase?: RoundPhase;
  isCurrentPlayerTurn?: boolean;
}


const PlayerRooms = ({ rooms, onRoomClick, roundPhase, isCurrentPlayerTurn = false }: PlayerRoomsProps) => {
  const sortedRooms = [...rooms].sort((a, b) => a.quality - b.quality);
  const roomsByQuality = [
    sortedRooms.find(r => r.quality === 1),
    sortedRooms.find(r => r.quality === 2),
    sortedRooms.find(r => r.quality === 3),
    sortedRooms.find(r => r.quality === 4),
  ];

  const isRoomBidPhase = roundPhase === 'room_bid';

  const handleRoomClick = (room: RoomCard | undefined) => {
    if (!room || !onRoomClick) return;
    
    const hasGuest = room.guest !== null;
    const isClickable = isRoomBidPhase && isCurrentPlayerTurn && !hasGuest;
    
    if (isClickable) {
      onRoomClick(room.id);
    }
  };

  return (
    <div className="w-[200px] h-[200px] grid grid-cols-2 grid-rows-2 gap-0 rounded-md">
      {roomsByQuality.map((room, index) => {
        const position = index + 1;
        const hasGuest = room?.guest?.portrait_url;
        const isEmptyRoom = !hasGuest;
        const isClickable = isRoomBidPhase && isCurrentPlayerTurn && isEmptyRoom;

        return (
          <div
            key={position}
            onClick={() => handleRoomClick(room)}
            className={`border border-gray-400 flex items-center justify-center bg-gray-100 relative transition-all duration-300 ${
              isClickable ? 'cursor-pointer grayscale hover:grayscale-0 hover:ring-2 hover:ring-yellow-400' : 
              isEmptyRoom ? 'grayscale' : 'cursor-default'
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