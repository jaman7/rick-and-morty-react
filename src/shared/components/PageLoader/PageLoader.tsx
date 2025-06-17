import { memo } from 'react';

const PageLoader = () => (
  <div className="scene" role="status" aria-busy="true" aria-live="polite" aria-label="Loading content">
    <div className="cube-wrapper" aria-hidden="true">
      <div className="cube">
        <div className="cube-faces">
          <div className="cube-face shadow" aria-hidden="true"></div>
          <div className="cube-face bottom" aria-hidden="true"></div>
          <div className="cube-face top" aria-hidden="true"></div>
          <div className="cube-face left" aria-hidden="true"></div>
          <div className="cube-face right" aria-hidden="true"></div>
          <div className="cube-face back" aria-hidden="true"></div>
          <div className="cube-face front" aria-hidden="true"></div>
        </div>
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export default memo(PageLoader);
