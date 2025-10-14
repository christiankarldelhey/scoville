import type { GuestCard } from '../../types/types';
import type { Suit } from '../../types/types';
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
import score from '../../assets/simbolos/puntaje.png';

interface PlayerScoreProps {
  guests: GuestCard[];
}

const symbolMap: Record<string, string> = {
  cerveza,
  comida,
  fuego,
  juegos,
  musica,
  sofa,
  te,
  torta,
  whisky,
  discount
};

export default function PlayerScore({ guests }: PlayerScoreProps) {
  const pointsBySuit = (suit: Suit) => {
  return guests
    .filter((guest) => guest.suit === suit)
    .map((guest) => guest.value);
  }

  return (
    <div className="fixed top-0 left-0 flex flex-col items-start gap-2 pt-4 pr-2 opacity-80">
      <div className="flex flex-row gap-4 relative">
        <img src={score} alt="puntaje" className="w-[60px] px-2" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg">27</span>
      </div>
        {pointsBySuit('locals').length > 0 && <div className="inline-flex gap-2 py-2 pl-2 pr-3 rounded-r-lg" style={{ backgroundColor: 'var(--color-locals)' }}>{pointsBySuit('locals').map((product, index) => 
          <img key={index} src={symbolMap[product]} alt={product} className="w-[20px]" />)}
        </div>}
        {pointsBySuit('travelers').length > 0 && <div className="inline-flex gap-2 py-2 pl-2 pr-3 rounded-r-lg" style={{ backgroundColor: 'var(--color-travelers)' }}>{pointsBySuit('travelers').map((product, index) => 
          <img key={index} src={symbolMap[product]} alt={product} className="w-[20px]" />)}
        </div>}
        {pointsBySuit('nobles').length > 0 && <div className="inline-flex gap-2 py-2 pl-2 pr-3 rounded-r-lg" style={{ backgroundColor: 'var(--color-nobles)' }}>{pointsBySuit('nobles').map((product, index) => 
          <img key={index} src={symbolMap[product]} alt={product} className="w-[20px]" />)}
        </div>}
    </div>
  );
}