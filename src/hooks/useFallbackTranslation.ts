import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

type TranslationFunction = (key: string, options?: any) => string;

const getNamespaceFromPath = (pathname: string): string | null => (pathname === '/' ? 'main' : null);

export const useFallbackTranslation = (): { t: TranslationFunction } => {
  const location = useLocation();
  const primaryNs = useMemo(() => getNamespaceFromPath(location.pathname), [location.pathname]);

  const { t: tFallback } = useTranslation('common');
  const { t: tPrimary } = useTranslation(primaryNs ?? 'common');

  const t: TranslationFunction = (key, options) => {
    const result = tPrimary(key, options);
    return result === key ? tFallback(key, options).toString() : result.toString();
  };

  return { t };
};
