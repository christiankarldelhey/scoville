import type { GuestCard } from '../../types/types';
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

interface RoomProps {
  guest: GuestCard;
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

const Room = ({ guest }: RoomProps) => {
  return (
    <>
      <img
        src={`/src/assets/characters-portraits/${guest.portrait_url}`}
        alt={guest.name || 'Guest'}
        className="w-full h-full object-cover"
      />
      <div
        className={`absolute bottom-0 left-0 w-[30px] h-[30px] ${
          SUIT_COLORS[guest.suit] || 'bg-gray-500'
        } flex items-center justify-center`}
      >
        <img
          src={PRODUCT_SYMBOLS[guest.product]}
          alt={guest.product}
          className="h-4 w-4"
        />
      </div>
      <div
        className={`absolute top-0 right-0 w-[30px] h-[30px] ${
          SUIT_COLORS[guest.suit] || 'bg-gray-500'
        } flex items-end justify-end p-0.5`}
      >
        <span className="text-white text-[8px] font-bold">
          {guest.used_nights}/{guest.total_nights}
        </span>
      </div>
    </>
  );
};

export default Room;
