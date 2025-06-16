import { IParams } from '@/core/services/http/http.models';
import HttpService from '@/core/services/http/http.service';
import { ICharactersResponse } from '@/shared/types/character';
import { catchError, from, map, Observable, of } from 'rxjs';

export const apiCharacters = 'https://rickandmortyapi.com/api/character';

const http = new HttpService();

export const getCharacters = (params: IParams): Observable<ICharactersResponse> => {
  return from(http.get<ICharactersResponse>(`${apiCharacters}/`, params)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching characters', error);
      return of(error);
    })
  );
};
