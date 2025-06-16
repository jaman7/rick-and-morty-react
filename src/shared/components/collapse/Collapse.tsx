import React, { useMemo, useState, useId } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import CollapseHeader from './CollapseHeader';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IPadding {
  paddingTop?: number | null;
  paddingRight?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
}

interface CollapseProps {
  children: React.ReactNode;
  duration?: number;
  ease?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear';
  padding?: IPadding | null;
  className?: string;
  iconArrowLast?: boolean;
  header?: string;
}

const defaultPadding: Required<IPadding> = {
  paddingTop: 8,
  paddingRight: 8,
  paddingBottom: 8,
  paddingLeft: 8,
};

const Collapse: React.FC<CollapseProps> = ({
  className,
  children,
  duration = 0.35,
  ease = 'easeInOut',
  padding = {},
  iconArrowLast = false,
  header,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { t } = useFallbackTranslation();
  const collapseId = useId();

  const mergedPadding: Required<IPadding> = useMemo(() => ({ ...defaultPadding, ...padding }), [padding]);
  const containerClass = useMemo(() => classNames('collapsed', className), [className]);

  return (
    <div className={containerClass}>
      {header && (
        <CollapseHeader
          id={collapseId}
          isOpen={collapsed}
          iconArrowLast={iconArrowLast}
          label={t(header)}
          onClick={() => setCollapsed((prev) => !prev)}
        />
      )}

      <motion.div
        id={`${collapseId}-content`}
        role="region"
        aria-labelledby={collapseId}
        initial={false}
        animate={{
          height: collapsed ? 'auto' : 0,
          opacity: collapsed ? 1 : 0,
          paddingLeft: `${mergedPadding.paddingLeft}px`,
          paddingRight: `${mergedPadding.paddingRight}px`,
          paddingTop: collapsed ? `${mergedPadding.paddingTop}px` : '0',
          paddingBottom: collapsed ? `${mergedPadding.paddingBottom}px` : '0',
        }}
        style={{ overflow: 'hidden' }}
        className="d-block"
        transition={{ duration, ease }}
        aria-hidden={!collapsed}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Collapse;
