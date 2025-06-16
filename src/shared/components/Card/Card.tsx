import { useEffect, useState, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import LazyImage from '../LazyImage/LazyImage';
import useResizeObserver from '@/hooks/useResizeObserver';
import './Card.scss';

interface CardProps {
  name: string;
  hoverable?: boolean;
  className?: string;
  image?: string | null;
  onResize?: (width: number, height: number) => void;
  children?: ReactNode;
  style?: CSSProperties;
}

const Card = ({ name = '', hoverable = false, className = '', image = '', onResize, children, style = {}, ...rest }: CardProps) => {
  const { ref, size } = useResizeObserver();
  const [prevSize, setPrevSize] = useState(size);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (size.width !== prevSize.width || size.height !== prevSize.height) {
      setPrevSize(size);
      onResize?.(size.width, size.height);
    }
  }, [size.width, size.height]);

  return (
    <motion.div
      ref={ref}
      role="group"
      aria-labelledby={`${name}-title`}
      className={`card ${hoverable ? 'hoverable' : ''} ${className}`}
      style={style}
      variants={variants}
      transition={{ duration: 0.3 }}
      {...rest}
    >
      {image && <LazyImage src={image} alt={name} />}
      <div className="card-body">
        {name && <div className="card-title">{name}</div>}
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
