import EventGrid from '../../components/common/EventGrid';
import type { PlayerScore } from '../../types/types';

interface ScoreProps {
  score: PlayerScore;
}

const EventScore = ({ score }: ScoreProps) => {

  return (
    <div className="fixed top-0 right-0 flex flex-col gap-1 p-4">
      <div className="flex bg-transparent">
        <EventGrid events={score?.events} suggestions={score?.can_score_event} />
      </div>
    </div>
  );
};

export default EventScore;