import { useState, useEffect } from 'react';

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onChange = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
  }, []);

  return {
    isMobile: width < 640,
    isTablet: width < 1024,
  };
}
