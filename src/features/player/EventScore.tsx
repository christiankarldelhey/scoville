import eventosImage from '../../assets/simbolos/eventos.png';

export default function EventScore() {
  return (
    <div className="fixed top-0 right-0 flex flex-col gap-1 p-4">
      <img 
        src={eventosImage} 
        alt="Eventos" 
        className="h-[130px]"
      />
    </div>
  );
}