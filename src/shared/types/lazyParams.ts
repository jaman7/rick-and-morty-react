import { IDictType } from '@/shared/types/dictionaryTypes'; // Replace with the correct path

export type ITableIconsType = 'VIEW' | 'EDIT' | 'DELETE' | 'ASSIGN';

export type ITableColumnsType = 'Text' | 'DateTime' | 'Checkbox' | 'Boolean' | 'UserList';

export type MatchModeTypes = 'equals' | 'startsWith' | 'contains' | 'in' | 'notContains' | 'endsWith' | 'notEquals' | 'inputIn';

export interface ITableColumns {
  field?: string;
  header?: string;
  type?: ITableColumnsType;
  sortField?: string;
  sortable?: boolean;
  formatDate?: string;
  dictName?: string;
  dictionary?: IDictType[];
  customHeader?: string;
  userLogoSize?: number;
  format?: string;
  diableFiltrSort?: boolean;
  filterType?: 'select' | 'input' | 'datepicker' | 'checkbox';

  filter?: {
    field?: string;
    type?: 'select' | 'input' | 'datepicker' | 'checkbox';
    matchMode?: MatchModeTypes;
    options?: { label: string; value: any }[];
    placeholder?: string;
    dateTimeType?: 'month' | 'year' | 'date';
    dateTimeMode?: 'single' | 'range';
    format?: string;
  };
  customizeValue?: <T>(val: T) => T | string;
}

export interface ILazyState {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  sort?: { field?: string | null; order?: undefined | null | 0 | 1 | -1 };
  filters?: Record<string, { value: any; matchMode?: MatchModeTypes }>;
  page?: number;
  pageSize?: number;
  pages?: number;
}
