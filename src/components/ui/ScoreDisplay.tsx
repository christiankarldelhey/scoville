import score from '../../assets/simbolos/puntaje.png';

interface ScoreDisplayProps {
  score: number;
  winner?: boolean;
}

export default function ScoreDisplay({ score: scoreValue, winner = false }: ScoreDisplayProps) {
  return (
    <div className={`flex flex-row gap-4 relative ${winner ? 'scale-120' : ''}`}>
      <img 
        src={score} 
        alt="puntaje" 
        className={`px-2 transition-all ${winner ? 'w-[72px] brightness-110' : 'w-[60px]'}`}
        style={winner ? { filter: 'brightness(1.1) hue-rotate(90deg) saturate(1.5)' } : undefined}
      />
      <span 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg ${winner ? 'font-bold' : ''}`}
      >
        {scoreValue}
      </span>
    </div>
  );
}
