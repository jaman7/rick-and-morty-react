import { useState, useEffect, useRef } from 'react';
import './LazyImage.scss';

export interface ILazyImage {
  id?: string;
  className?: string;
  src?: string | null;
  alt?: string;
  onClick?: () => void;
  placeholderSrc?: string;
}

const DEFAULT_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

const LazyImage: React.FC<ILazyImage> = ({ id, className, src = null, alt, onClick, placeholderSrc = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {!loaded && !error && (
        <img
          src={placeholderSrc || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}
          alt=""
          aria-hidden="true"
          role="presentation"
        />
      )}
      {!loaded && <div className="lazy-placeholder" data-testid="lazy-placeholder" aria-hidden="true" />}
      <img
        id={id}
        loading="lazy"
        src={error || !src ? DEFAULT_LOGO : src}
        alt={alt}
        ref={imgRef}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`img-fluid ${className} ${loaded ? 'lazyloaded' : 'lazyloading'}`}
        onClick={onClick}
      />
    </>
  );
};

export default LazyImage;
