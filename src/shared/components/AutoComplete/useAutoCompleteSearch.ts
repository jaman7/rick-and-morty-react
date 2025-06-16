import { useEffect, useRef } from 'react';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

type FetchFn<T> = (query: string) => Promise<T[]>;

export const useAutoCompleteSearch = <T>(query: string, fetchFn: FetchFn<T>, onResults: (res: T[]) => void) => {
  const input$ = useRef(new Subject<string>()).current;

  useEffect(() => {
    const sub = input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          if (!searchTerm || searchTerm.length < 2) return of([]);
          return fetchFn(searchTerm)
            .then((res) => res)
            .catch(() => []);
        })
      )
      .subscribe((results) => onResults(results));

    return () => sub.unsubscribe();
  }, [fetchFn]);

  useEffect(() => {
    input$.next(query);
  }, [query]);
};
