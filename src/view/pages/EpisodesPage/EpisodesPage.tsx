import { IParams } from '@/core/services/http/http.models';
import AutoComplete from '@/shared/components/AutoComplete/AutoComplete';
import Card from '@/shared/components/Card/Card';
import Paginator from '@/shared/components/Paginator/Paginator';
import { setTableParams } from '@/shared/utils/table-utils';
import { useCallback, useEffect, useState } from 'react';
import { apiEpisodes, getEpisodes } from './EpisodesPage.service';
import { catchError, of, tap } from 'rxjs';
import { IEpisodes } from '@/shared/types/character';
import { format } from 'date-fns/format';
import { DATE_TIME_FORMAT } from '@/shared/enums/date-time-formats';
import { ILazyState } from '@/shared/types/lazyParams';
import { useToast } from '@/hooks/useToast';

const EpisodesPage: React.FC = () => {
  const [data, setData] = useState<IEpisodes[]>([]);
  const [params, setParams] = useState<IParams>({ page: 1 });

  const toast = useToast();

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
      const subscription = getEpisodes(rest)
        .pipe(
          tap((res) => {
            const { results = [], info = {} } = res || {};

            if (results.length) {
              setParams((prevParams) => ({ ...prevParams, pages: info.pages }));
              setData(results ?? []);
            } else {
              toast.showError('Error fetching episodes');
            }
          }),
          catchError((error) => {
            console.error('Failed to fetch episodes.', error);
            return of({});
          })
        )
        .subscribe();
      return () => subscription.unsubscribe();
    },
    [params]
  );

  useEffect(() => {
    getData(params);
  }, []);

  return (
    <div className="main-page-container">
      <h2 className="page-title">Episodes</h2>

      <AutoComplete
        url={apiEpisodes}
        queryVal={(params?.name as string) ?? ''}
        paramName="name"
        onSelect={(name) => getData({ ...params, page: 1, filters: { ['name']: { value: name, matchMode: 'contains' } } })}
        className="py-3"
      />

      <div className="paginator-top">
        <Paginator
          currentPage={typeof params.page === 'number' ? params.page : 1}
          totalPages={typeof params.pages === 'number' ? params.pages : 1}
          onPageChange={(newPage) => getData({ ...params, page: newPage })}
          maxVisiblePages={3}
        />
      </div>

      <div className="page-layout-one-col">
        <div className="card-grid">
          {data?.map((item, i) => (
            <Card key={`card-main-${i}`} hoverable={true} name={item.name} image={null}>
              <div className="main-card-content">
                <div className="card-footer">
                  <span>Created: {format(new Date(item.created as string), DATE_TIME_FORMAT.FNS_DATE)}</span>
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

export default EpisodesPage;
