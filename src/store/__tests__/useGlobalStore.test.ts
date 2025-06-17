import { useGlobalStore } from '@/store/useGlobalStore';
import { describe, expect, it } from 'vitest';

describe('useGlobalStore', () => {
  it('should have initial state isLoading = false', () => {
    const { isLoading } = useGlobalStore.getState();
    expect(isLoading).toBe(false);
  });

  it('should update isLoading to true', () => {
    useGlobalStore.getState().setIsLoading(true);
    expect(useGlobalStore.getState().isLoading).toBe(true);
  });

  it('should update isLoading to false', () => {
    useGlobalStore.getState().setIsLoading(false);
    expect(useGlobalStore.getState().isLoading).toBe(false);
  });
});
