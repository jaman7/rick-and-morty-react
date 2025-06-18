import { IEpisode } from '@/shared/types/character';
import './EpisodesTimeline.scss';

const EpisodesTimeline = ({ episodes }: { episodes: IEpisode[] }) => {
  return (
    <div className="episodes-timeline">
      <h3 className="page-title text-center">Episode Timeline</h3>
      <div className="timeline-container">
        <ul className="timeline">
          {episodes.map((ep) => (
            <li key={ep.id} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-episode">{ep.episode}</span>
                  <span className="timeline-date">({ep.air_date})</span>
                </div>
                <div className="timeline-title">{ep.name}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EpisodesTimeline;
