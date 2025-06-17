import { IParams } from '@/core/services/http/http.models';
import { ILazyState } from '../types/lazyParams';

export function setTableParams(event: ILazyState): IParams {
  const tableParam: IParams | any = {};
  const { page, pages, pageSize, sortOrder, sortBy: sortField, filters } = event;

  tableParam.page = page ?? null;
  tableParam.pages = pages ?? null;
  tableParam.pageSize = pageSize ?? null;
  tableParam.sortBy = sortField ?? '';
  tableParam.sortOrder = sortOrder;

  if (filters && Object.keys(filters)?.length) {
    Object.entries(filters)?.forEach(([key, data]) => {
      const { value } = data || {};
      if (value !== null) {
        if (typeof value !== 'string' || value.length >= 1) {
          tableParam[key] = value;
        } else {
          delete tableParam[key];
        }
      } else if (tableParam[key]) {
        delete tableParam[key];
      }
    });
  }

  if (!tableParam?.sortBy || tableParam.sortBy === '') delete tableParam.sortBy;
  if (!tableParam?.sortOrder) delete tableParam.sortOrder;

  return tableParam;
}
