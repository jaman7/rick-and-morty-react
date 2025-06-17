import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Collapse from '@/shared/components/collapse/Collapse';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { FaAngleLeft } from 'react-icons/fa';
import classNames from 'classnames';
import { useFiltersPanelState } from './useFiltersPanelState';
import FiltersPanelHeader from './FiltersPanelHeader';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import './FiltersPanel.scss';

export type FilterConfig = {
  [filterKey: string]: {
    value: string[];
    multiple?: boolean;
  };
};

export type MatchModeTypes = 'equals' | 'in';

export type FiltersOutput = Record<string, { value: string[]; matchMode: MatchModeTypes }>;

interface FiltersPanelProps {
  config: FilterConfig;
  onChange: (filters: FiltersOutput) => void;
  isPinned?: boolean;
  onPinChange?: (pinned: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  config,
  onChange,
  isPinned: externallyPinned = false,
  onPinChange,
  onCollapseChange,
}) => {
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  const { t } = useFallbackTranslation();

  const { collapsed, contentVisible, tabVisible, isPinned, toggleCollapse, togglePin, handleTabVisible } =
    useFiltersPanelState(externallyPinned);

  useEffect(() => {
    onPinChange?.(isPinned);
  }, [isPinned]);

  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed]);

  useEffect(() => {
    const filters: FiltersOutput = Object.entries(selected).reduce((acc, [key, set]) => {
      acc[key] = { value: Array.from(set), matchMode: 'in' };
      return acc;
    }, {} as FiltersOutput);

    onChange(filters);
  }, [selected]);

  const handleToggle = useCallback((category: string, value: string, isMultiple = false) => {
    setSelected((prev) => {
      const current = new Set(prev[category] ?? []);
      if (isMultiple) {
        current.has(value) ? current.delete(value) : current.add(value);
        return { ...prev, [category]: current };
      } else {
        return { ...prev, [category]: new Set([value]) };
      }
    });
  }, []);

  const handleClear = () => {
    setSelected({});
  };

  const panelWidth = useMemo(() => (collapsed ? 0 : 240), [collapsed]);

  const containerClass = classNames('filters-panel-box', {
    fixed: isPinned,
    collapsed: collapsed,
  });

  return (
    <motion.aside
      role="complementary"
      aria-labelledby="filters-panel-heading"
      initial={{ width: panelWidth }}
      animate={{ width: panelWidth }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={handleTabVisible}
      className={containerClass}
    >
      {!collapsed && (
        <div className="filters-panel-toggle">
          <Button
            className="btn-pined"
            name={t(`common.buttons.${isPinned ? 'unPin' : 'pin'}`)}
            variant={ButtonVariant.SECONDARY}
            size="xs"
            handleClick={togglePin}
          />
        </div>
      )}

      <AnimatePresence>
        {contentVisible && (
          <motion.div
            key="filters-content"
            className="filters-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FiltersPanelHeader onClear={handleClear} />

            {Object.entries(config).map(([category, { value, multiple = false }]) => (
              <Collapse key={category} header={category}>
                <div className="filters-panel__options">
                  {value.map((val) => {
                    const isActive = selected[category]?.has(val);
                    return (
                      <Button
                        key={val}
                        variant={ButtonVariant.SECONDARY}
                        className={isActive ? 'active' : ''}
                        handleClick={() => handleToggle(category, val, multiple)}
                        aria-label={`${category}-${val}`}
                        data-testid={`${category}-${val}`}
                      >
                        {val}
                      </Button>
                    );
                  })}
                </div>
              </Collapse>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tabVisible && collapsed && (
          <motion.div
            className="filters-tab"
            onClick={toggleCollapse}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            aria-label="Filters open"
            role="button"
          >
            Filters
          </motion.div>
        )}
      </AnimatePresence>

      {!collapsed && (
        <Button className="btn-collapse" aria-label="collapse" variant={ButtonVariant.ROUND} size="xs" handleClick={toggleCollapse}>
          <FaAngleLeft className={classNames('icon-collapse', { open: collapsed })} />
        </Button>
      )}
    </motion.aside>
  );
};

export default FiltersPanel;
