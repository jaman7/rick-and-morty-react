import { useCallback, useMemo, useState } from 'react';
import { apiCharacters, getCharacters } from './MainPage.service';
import { catchError, of, tap } from 'rxjs';
import { ICharacter } from '@/shared/types/character';
import { setTableParams } from '@/shared/utils/table-utils';
import { IParams } from '@/core/services/http/http.models';
import Card from '@/shared/components/Card/Card';
import Paginator from '@/shared/components/Paginator/Paginator';
import AutoComplete from '@/shared/components/AutoComplete/AutoComplete';
import FiltersPanel from '@/shared/components/FiltersPanel/FiltersPanel';
import { filtersConfig } from './MainPage.config';
import classNames from 'classnames';
import { ILazyState } from '@/shared/types/lazyParams';
import { useToast } from '@/hooks/useToast';
import './MainPage.scss';

const MainPage: React.FC = () => {
  const [data, setData] = useState<ICharacter[]>([]);
  const [params, setParams] = useState<IParams>({ page: 1 });
  const [isFilterPinned, setIsFilterPinned] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const toast = useToast();

  const containerClass = useMemo(
    () =>
      classNames('page-layout', {
        'with-fixed-panel': isFilterPinned,
        'collapsed-panel': isFilterCollapsed,
        'without-pinned-panel': !isFilterPinned && isFilterCollapsed,
      }),
    [isFilterPinned, isFilterCollapsed]
  );

  const getData = useCallback(
    (event?: ILazyState) => {
      const baseParams = { ...setTableParams(event as ILazyState) };
      if (!baseParams?.page) return;
      const fullParams = {
        ...baseParams,
      };
      setParams(fullParams);
      if (fullParams?.pageSize) delete fullParams.pageSize;
      const { pages, ...rest } = fullParams || {};
      const subscription = getCharacters(rest)
        .pipe(
          tap((res) => {
            const { results = [], info = {} } = res || {};
            if (results.length) {
              setParams((prevParams) => ({ ...prevParams, pages: info.pages }));
              setData(results ?? []);
            } else {
              toast.showError('Error fetching characters');
            }
          }),
          catchError((error) => {
            console.error('Error fetching characters', error);
            return of({});
          })
        )
        .subscribe();
      return () => subscription.unsubscribe();
    },
    [params]
  );

  return (
    <div className="main-page-container">
      <h2 className="page-title">Characters</h2>

      <AutoComplete
        url={apiCharacters}
        queryVal={(params?.name as string) ?? ''}
        paramName="name"
        onSelect={(name) => getData({ ...params, page: 1, filters: { ['name']: { value: name, matchMode: 'contains' } } })}
        className="my-3"
      />

      <div className="paginator-top">
        <Paginator
          currentPage={typeof params.page === 'number' ? params.page : 1}
          totalPages={typeof params.pages === 'number' ? params.pages : 1}
          onPageChange={(newPage) => getData({ ...params, page: newPage })}
          maxVisiblePages={3}
        />
      </div>

      <div className={containerClass}>
        <FiltersPanel
          isPinned={isFilterPinned}
          onPinChange={setIsFilterPinned}
          onCollapseChange={setIsFilterCollapsed}
          config={filtersConfig}
          onChange={(filters) => {
            getData({ ...params, page: 1, filters });
          }}
        />

        <div className="card-grid">
          {data?.map((item, i) => (
            <Card key={`card-main-${i}`} hoverable={true} name={item.name} image={item.image}>
              <div className="main-card-content">
                <div className="main-card-content__status">
                  Status: <span className={`status status--${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
                <div className="main-card-content__species">
                  Species: <span>{item.species}</span>
                </div>

                <div className="card-footer">
                  <span>Origin: {item.origin.name}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="paginator-bottom">
        <Paginator
          currentPage={typeof params.page === 'number' ? params.page : 1}
          totalPages={typeof params.pages === 'number' ? params.pages : 1}
          onPageChange={(newPage) => getData({ ...params, page: newPage })}
        />
      </div>
    </div>
  );
};

export default MainPage;
