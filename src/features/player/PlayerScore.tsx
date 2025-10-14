import PlayerScoreExample from '../../data/player-score-example.json'
import type { GuestCard } from '../../types/types';
import type { Suit } from '../../types/types';
import monedaImage from '../../assets/moneda.png';


export default function PlayerScore() {
  const guests = PlayerScoreExample[0].former_guests;
  const pointsBySuit = (suit: Suit) => {
  return guests
    .filter((guest) => guest.suit === suit)
    .map((guest) => guest.value);
  }

  return (
    <div className="fixed top-0 left-0 flex flex-col gap-2 pt-4 opacity-80">
        <div className="w-[25px] h-[25px] rounded-full bg-[#ceaa03]">  
        </div>
        <div 
          className="h-[30px] rounded-r-lg" 
          style={{ 
            width: `${pointsBySuit('locals').length * 50}px`,
            backgroundColor: 'var(--color-locals)' }}
        />
        <div 
          className="h-[30px] rounded-r-lg" 
          style={{ 
            width: `${pointsBySuit('travelers').length * 50}px`, 
            backgroundColor: 'var(--color-travelers)' }}
        />
        <div 
          className="h-[30px] rounded-r-lg" 
          style={{ 
            width: `${pointsBySuit('nobles').length * 50}px`,
            backgroundColor: 'var(--color-nobles)' }}
        />
        
    </div>
  );
}