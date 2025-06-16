import { IParams } from '@/core/services/http/http.models';
import HttpService from '@/core/services/http/http.service';
import { ILocationResponse } from '@/shared/types/character';
import { catchError, from, map, Observable, of } from 'rxjs';

export const apiLocation = 'https://rickandmortyapi.com/api/location';

const http = new HttpService();

export const getLocations = (params: IParams): Observable<ILocationResponse> => {
  return from(http.get<ILocationResponse>(`${apiLocation}/`, params)).pipe(
    map((response) => {
      return response ?? {};
    }),
    catchError((error) => {
      console.error('Error fetching location', error);
      return of(error);
    })
  );
};
