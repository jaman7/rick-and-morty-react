import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ICharacter, IEpisode } from '@/shared/types/character';
import { getCharacterById, getCharactersByUrls, getEpisodesByUrls, getLocationByUrl } from './DetailPage.service';
import CharacterInfo from './CharacterInfo/CharacterInfo';
import EpisodesTimeline from './EpisodesTimeline/EpisodesTimeline';
import RelatedCharacters from './RelatedCharacters/RelatedCharacters';
import CharacterHero from './CharacterHero/CharacterHero';
import { forkJoin, of, switchMap, tap } from 'rxjs';
import './DetailPage.scss';

const DetailPage = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);
  const [related, setRelated] = useState<ICharacter[]>([]);

  useEffect(() => {
    if (!id) return;

    const subscription = getCharacterById(id)
      .pipe(
        tap((char) => setCharacter(char)),
        switchMap((char) => {
          const episode$ = getEpisodesByUrls(char.episode);
          const related$ = char.location?.url
            ? getLocationByUrl(char.location.url).pipe(
                switchMap((loc) => {
                  const urls = loc.residents.filter((url) => url !== char.url).slice(0, 6);
                  return urls.length ? getCharactersByUrls(urls) : of([]);
                })
              )
            : of([]);

          return forkJoin([episode$, related$]);
        })
      )
      .subscribe({
        next: ([ep, relatedChars]) => {
          setEpisodes(ep);
          setRelated(relatedChars);
        },
        error: (err) => console.error('DetailPage error', err),
      });

    return () => subscription.unsubscribe();
  }, [id]);
  if (!character) return <div className="loading">Loading...</div>;

  return (
    <div className="detail-page">
      <CharacterHero character={character ?? {}} />

      <CharacterInfo character={character ?? {}} />

      <EpisodesTimeline episodes={episodes ?? []} />

      <RelatedCharacters characters={related ?? []} />
    </div>
  );
};

export default DetailPage;
