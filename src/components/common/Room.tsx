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
import reverse from '../../assets/reverse.png';
import puntaje from '../../assets/simbolos/puntaje.png';

interface RoomProps {
  guest?: GuestCard | null;
  isPointAssignment?: boolean;
  isToggled?: boolean;
  onClick?: () => void;
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

const Room = ({ guest, isPointAssignment = false, isToggled = false, onClick }: RoomProps) => {
  if (isPointAssignment) {
    const hasGuest = !!guest;
    
    return (
      <>
        {hasGuest && guest && (
          <img
            src={`/src/assets/characters-portraits/${guest.portrait_url}`}
            alt={guest.name || 'Guest'}
            className="w-full h-full object-cover"
          />
        )}
        {/* Capa de opacidad oscura */}
        <div className={`absolute inset-0 bg-black ${hasGuest ? 'opacity-30' : 'opacity-60'}`} />
        
        {/* Elemento central */}
        <div 
          className={`absolute inset-0 flex items-center justify-center ${hasGuest ? 'cursor-pointer' : ''}`}
          onClick={hasGuest ? onClick : undefined}
        >
          {!hasGuest || isToggled ? (
            // Sin guest o toggleado: mostrar reverse.png
            <img
              src={reverse}
              alt="Empty room"
              className="opacity-90 h-14 object-contain"
            />
          ) : (
            // Con guest y no toggleado: mostrar puntaje.png con número 1
            <div className="relative w-16 h-16 flex items-center justify-center">
              <img
                src={puntaje}
                alt="Score"
                className="w-full h-full object-contain"
              />
              <span className="absolute text-white text-2xl font-bold">
                1
              </span>
            </div>
          )}
        </div>
      </>
    );
  }

  // Comportamiento normal (sin isPointAssignment)
  if (!guest) return null;
  
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
