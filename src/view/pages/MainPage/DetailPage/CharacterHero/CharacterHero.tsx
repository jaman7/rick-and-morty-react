import { ICharacter } from '@/shared/types/character';
import './CharacterHero.scss';
import LazyImage from '@/shared/components/LazyImage/LazyImage';
import { motion } from 'framer-motion';

const CharacterHero = ({ character }: { character: ICharacter }) => {
  return (
    <motion.div className="character-hero" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="character-hero__bg" aria-hidden="true" />
      <LazyImage src={character.image} alt={character.name} />
      <div className="hero-info">
        <h1>{character.name}</h1>
        <div className={`status status--${character.status.toLowerCase()}`}>{character.status}</div>
        <p>
          <strong>Species:</strong> {character.species} {character.type ? `– ${character.type}` : ''}
          <br />
          <strong>Gender:</strong> {character.gender}
        </p>
      </div>
    </motion.div>
  );
};

export default CharacterHero;
