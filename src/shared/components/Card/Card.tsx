import { useEffect, useState, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import LazyImage from '../LazyImage/LazyImage';
import useResizeObserver from '@/hooks/useResizeObserver';
import classNames from 'classnames';
import './Card.scss';
import { NavLink } from 'react-router-dom';

interface CardProps {
  name: string;
  isEffect?: boolean;
  className?: string;
  image?: string | null;
  onResize?: (width: number, height: number) => void;
  link?: string;
  linkTarget?: '_blank' | '_self' | '_parent' | '_top' | '';
  clickable?: boolean;
  showFooterLink?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

const Card = ({
  name = '',
  isEffect = false,
  className = '',
  image = '',
  onResize,
  showFooterLink = false,
  clickable = false,
  link = '',
  linkTarget = '',
  children,
  style = {},
  ...rest
}: CardProps) => {
  const anchorObserver = useResizeObserver<HTMLAnchorElement>();
  const divObserver = useResizeObserver<HTMLDivElement>();

  const isLink = clickable && !!link;
  const { size } = clickable && isLink ? anchorObserver : divObserver;
  const resizeRef = clickable && isLink ? anchorObserver : divObserver;
  const [prevSize, setPrevSize] = useState(resizeRef.size);

  useEffect(() => {
    if (size.width !== prevSize.width || size.height !== prevSize.height) {
      setPrevSize(size);
      onResize?.(size.width, size.height);
    }
  }, [size.width, size.height]);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const content = (
    <>
      {image && <LazyImage src={image} alt={name} />}
      <div className="card-body">
        {name && (
          <div className="card-title" id={`${name}-title`}>
            {name}
          </div>
        )}
        {children}
        {showFooterLink && link && !isEffect && (
          <div className="d-block mt-2">
            <NavLink to={link} target={linkTarget || undefined} className="card-link">
              View more
            </NavLink>
          </div>
        )}
      </div>
    </>
  );

  const overlay = isEffect && (
    <>
      <div className="card-overlay-box" aria-hidden="true" />
      <div className="card-overlay-box-text" aria-hidden="false" aria-label="Details">
        Details
      </div>
    </>
  );

  const innerContent = (
    <>
      {content}
      {overlay}
    </>
  );

  const id = `card-title-${name.replace(/\s+/g, '-').toLowerCase()}`;
  const isExternal = linkTarget === '_blank';
  const linkProps = {
    to: link,
    target: linkTarget || undefined,
    rel: isExternal ? 'noopener noreferrer' : undefined,
  };

  return (
    <motion.div
      ref={divObserver.ref}
      role="group"
      aria-labelledby={id}
      className={classNames('card', className, { hoverable: isEffect })}
      style={style}
      variants={variants}
      transition={{ duration: 0.3 }}
      {...rest}
    >
      {clickable && link ? (
        <NavLink className="card-container-link flex-column space-between" {...linkProps} {...rest}>
          {innerContent}
        </NavLink>
      ) : (
        innerContent
      )}
    </motion.div>
  );
};

export default Card;
