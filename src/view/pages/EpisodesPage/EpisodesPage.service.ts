import { IParams } from '@/core/services/http/http.models';
import HttpService from '@/core/services/http/http.service';
import { IEpisodesResponse } from '@/shared/types/character';
import { catchError, from, map, Observable, of } from 'rxjs';

export const apiEpisodes = 'https://rickandmortyapi.com/api/episode';

const http = new HttpService();

export const getEpisodes = (params: IParams): Observable<IEpisodesResponse> => {
  return from(http.get<IEpisodesResponse>(`${apiEpisodes}/`, params)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching episodes', error);
      return of(error);
    })
  );
};
