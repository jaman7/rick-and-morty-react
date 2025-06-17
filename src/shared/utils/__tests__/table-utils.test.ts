import { ILazyState } from '@/shared/types/lazyParams';
import { setTableParams } from '@/shared/utils/table-utils';

describe('setTableParams', () => {
  it('should return correct base pagination and sorting params', () => {
    const input: ILazyState = {
      page: 2,
      pageSize: 10,
      sortBy: 'name',
      sortOrder: 'asc',
    };
    const result = setTableParams(input);
    expect(result).toEqual({
      page: 2,
      pages: null,
      pageSize: 10,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  });

  it('should remove empty sortBy and sortOrder', () => {
    const input: ILazyState = {
      page: 1,
      sortBy: '',
      sortOrder: undefined,
    };
    const result = setTableParams(input);
    expect(result).not.toHaveProperty('sortBy');
    expect(result).not.toHaveProperty('sortOrder');
  });

  it('should apply valid string filter values', () => {
    const input: ILazyState = {
      page: 1,
      filters: {
        name: { value: 'Rick' },
      },
    };
    const result = setTableParams(input);
    expect(result.name).toBe('Rick');
  });

  it('should skip empty string filter values', () => {
    const input: ILazyState = {
      page: 1,
      filters: {
        name: { value: '' },
      },
    };
    const result = setTableParams(input);
    expect(result).not.toHaveProperty('name');
  });

  it('should keep numeric or boolean filter values', () => {
    const input: ILazyState = {
      page: 1,
      filters: {
        age: { value: 30 },
        active: { value: true },
      },
    };
    const result = setTableParams(input);
    expect(result.age).toBe(30);
    expect(result.active).toBe(true);
  });

  it('should update pages and cleanup pageSize', () => {
    const input: ILazyState = {
      page: 3,
      pages: 9,
      pageSize: 20,
    };
    const result = setTableParams(input);
    expect(result.page).toBe(3);
    expect(result.pages).toBe(9);
    expect(result.pageSize).toBe(20);
  });
});
