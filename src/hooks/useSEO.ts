import { useEffect } from 'react';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

/**
 * Custom hook for managing SEO meta tags
 * @param config SEO configuration for the current page
 */
const useSEO = (config: Parameters<typeof updateMetaTags>[0]) => {
  useEffect(() => {
    updateMetaTags(config);
  }, [config]);
};

export default useSEO;