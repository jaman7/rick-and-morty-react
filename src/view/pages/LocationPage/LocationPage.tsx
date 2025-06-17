import AutoComplete from '@/shared/components/AutoComplete/AutoComplete';
import Card from '@/shared/components/Card/Card';
import Paginator from '@/shared/components/Paginator/Paginator';
import { DATE_TIME_FORMAT } from '@/shared/enums/date-time-formats';
import { format } from 'date-fns/format';
import { apiLocation, getLocations } from './LocationPage.service';
import { useCallback, useEffect, useState } from 'react';
import { catchError, of, tap } from 'rxjs';
import { setTableParams } from '@/shared/utils/table-utils';
import { ILocation } from '@/shared/types/character';
import { IParams } from '@/core/services/http/http.models';
import { ILazyState } from '@/shared/types/lazyParams';
import { useToast } from '@/hooks/useToast';

const LocationPage: React.FC = () => {
  const [data, setData] = useState<ILocation[]>([]);
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
      const subscription = getLocations(rest)
        .pipe(
          tap((res) => {
            const { results = [], info = {} } = res || {};

            if (results.length) {
              setParams((prevParams) => ({ ...prevParams, pages: info.pages }));
              setData(results ?? []);
            } else {
              toast.showError('Error fetching locations');
            }
          }),
          catchError((error) => {
            console.error('Failed to fetch locations.', error);
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
      <h2 className="page-title">Location</h2>

      <AutoComplete
        url={apiLocation}
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

export default LocationPage;
