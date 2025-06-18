import { ICharacter } from '@/shared/types/character';
import './CharacterInfo.scss';

const CharacterInfo = ({ character }: { character: ICharacter }) => {
  return (
    <div className="character-info">
      <h3 className="page-title">Character Info</h3>
      <ul>
        <li>
          <strong>Species:</strong> {character.species}
        </li>
        {character.type && (
          <li>
            <strong>Type:</strong> {character.type}
          </li>
        )}
        <li>
          <strong>Gender:</strong> {character.gender}
        </li>
        <li>
          <strong>Status:</strong> {character.status}
        </li>
        <li>
          <strong>Origin:</strong> {character.origin?.name}
        </li>
        <li>
          <strong>Location:</strong> {character.location?.name}
        </li>
      </ul>
    </div>
  );
};

export default CharacterInfo;
