import { ICharacter } from '@/shared/types/character';
import { Link } from 'react-router-dom';
import './RelatedCharacters.scss';
import LazyImage from '@/shared/components/LazyImage/LazyImage';

const RelatedCharacters = ({ characters }: { characters: ICharacter[] }) => {
  return (
    <div className="related-characters">
      <h3 className="page-title mb-3">Other Characters from this Location</h3>
      <div className="related-grid">
        {characters.map((char) => (
          <Link to={`/character/${char.id}`} key={char.id} className="related-card">
            <LazyImage src={char.image} alt={char.name} />
            <span>{char.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedCharacters;
