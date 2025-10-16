import EventGrid from '../../components/common/EventGrid';
import type { Event as GameEvent } from '../../types/types';

interface EventScoreProps {
  events: GameEvent[];
}

const EventScore = ({ events }: EventScoreProps) => {

  return (
    <div className="fixed top-0 right-0 flex flex-col gap-1 p-4">
      <div className="flex bg-transparent">
        <EventGrid events={events} />
      </div>
    </div>
  );
};

export default EventScore;