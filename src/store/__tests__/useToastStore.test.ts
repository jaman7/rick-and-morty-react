import { ToastItem, useToastStore } from '@/store/useToastStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useToastStore', () => {
  const sampleToast: ToastItem = {
    id: '1',
    message: 'Test toast',
    type: 'success',
    duration: 3000,
  };

  beforeEach(() => {
    useToastStore.getState().reset(); // Clean slate before each test
  });

  it('should start with an empty toast list', () => {
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('should add a toast', () => {
    useToastStore.getState().addToast(sampleToast);
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0]).toEqual(sampleToast);
  });

  it('should remove a toast by id', () => {
    useToastStore.getState().addToast(sampleToast);
    useToastStore.getState().removeToast('1');
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('should reset all toasts', () => {
    useToastStore.getState().addToast(sampleToast);
    useToastStore.getState().reset();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
