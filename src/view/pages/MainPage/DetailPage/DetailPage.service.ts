import HttpService from '@/core/services/http/http.service';
import { ICharacter, IEpisode, ILocation } from '@/shared/types/character';
import { catchError, from, map, Observable, of } from 'rxjs';

export const api = 'https://rickandmortyapi.com/api';

const http = new HttpService();

export const getCharacterById = (id: string): Observable<ICharacter> => {
  return from(http.get<ICharacter>(`${api}/character/${id}`, {})).pipe(
    map((response) => response ?? {}),
    catchError((error) => {
      console.error('Error fetching character', error);
      return of(error);
    })
  );
};

export const getEpisodesByUrls = (urls: string[]): Observable<IEpisode[]> => {
  const episodeIds = urls.map((url) => url.split('/').pop()).join(',');
  return from(http.get<IEpisode[]>(`${api}/episode/${episodeIds}`, {})).pipe(
    map((response) => (Array.isArray(response) ? response : [response])),
    catchError((error) => {
      console.error('Error fetching episode', error);
      return of(error);
    })
  );
};

export const getLocationByUrl = (url: string): Observable<ILocation> => {
  return from(http.get<ILocation>(url, {})).pipe(
    map((response) => response),
    catchError((error) => {
      console.error('Error fetching character location', error);
      return of(error);
    })
  );
};

export const getCharactersByUrls = (urls: string[]): Observable<ICharacter[]> => {
  const ids = urls.map((url) => url.split('/').pop()).join(',');
  return from(http.get<ICharacter[]>(`${api}/character/${ids}`, {})).pipe(
    map((response) => (Array.isArray(response) ? response : [response])),
    catchError((error) => {
      console.error('Error fetching characters', error);
      return of(error);
    })
  );
};
