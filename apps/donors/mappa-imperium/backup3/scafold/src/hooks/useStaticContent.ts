import { useState, useEffect } from 'react';
import { contentData } from '../data/referenceTables';

/**
 * Google Cloud Run Optimized Static Content Hook
 * 
 * Key Optimizations for Google Cloud Run:
 * 1. NO network requests in production (eliminates 404s and 160-380ms delays)
 * 2. Instant content loading from bundled JavaScript
 * 3. Zero dependency on file system or static file serving
 * 4. Maintains development flexibility for local editing
 * 5. Stateless operation (Cloud Run requirement)
 */
const STATIC_CONTENT_MAP: Record<string, string> = contentData;

// Environment detection optimized for Google Cloud Run
export const isGoogleCloudRun = (): boolean => {
  // Multiple detection methods for reliability
  return (
    // Primary: Google Cloud Run hostname pattern
    window.location.hostname.includes('.run.app') ||
    window.location.hostname.includes('cloudrun') ||
    window.location.hostname.includes('.goog') ||
    // Secondary: PORT environment variable (Cloud Run might not expose this to client, but good practice)
    (process.env.PORT && process.env.PORT !== '3000') ||
    // Tertiary: Production environment
    process.env.NODE_ENV === 'production'
  );
};

// Lightweight in-memory cache (for development only)
const contentCache = new Map<string, string>();

interface StaticContentState {
  content: string | null;
  isLoading: boolean;
  error: string | null;
  source: 'cache' | 'bundled' | 'fetch' | null;
  loadTime?: number;
}

export const useStaticContent = (filePath: string): StaticContentState => {
  const [state, setState] = useState<StaticContentState>({
    content: null,
    isLoading: true,
    error: null,
    source: null
  });

  useEffect(() => {
    if (!filePath || filePath.trim() === '') {
      setState({ content: null, isLoading: false, error: null, source: null });
      return;
    }

    const startTime = performance.now();

    if (!isGoogleCloudRun() && contentCache.has(filePath)) {
      const loadTime = performance.now() - startTime;
      setState({ content: contentCache.get(filePath)!, isLoading: false, error: null, source: 'cache', loadTime });
      return;
    }

    if (isGoogleCloudRun()) {
      const content = STATIC_CONTENT_MAP[filePath];
      const loadTime = performance.now() - startTime;
      
      if (content) {
        setState({ content, isLoading: false, error: null, source: 'bundled', loadTime });
      } else {
        setState({ content: null, isLoading: false, error: `Content not found in bundle: ${filePath}`, source: null, loadTime });
      }
      return;
    }

    setState({ content: null, isLoading: true, error: null, source: null });

    const loadContentDev = async () => {
      try {
        const response = await fetch(filePath);
        const loadTime = performance.now() - startTime;
        
        if (response.ok) {
          const textContent = await response.text();
          contentCache.set(filePath, textContent);
          setState({ content: textContent, isLoading: false, error: null, source: 'fetch', loadTime });
          return;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (fetchError) {
        const loadTime = performance.now() - startTime;
        console.warn(`[Development] Fetch failed for ${filePath}, falling back to bundled content:`, fetchError);
        
        const content = STATIC_CONTENT_MAP[filePath];
        
        if (content) {
          contentCache.set(filePath, content);
          setState({ content, isLoading: false, error: null, source: 'bundled', loadTime });
        } else {
          setState({ content: null, isLoading: false, error: `Content not available: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`, source: null, loadTime });
        }
      }
    };

    loadContentDev();
  }, [filePath]);

  return state;
};

// Debug utilities for the debug menu
export const getCloudRunOptimizedDebugInfo = () => {
  const environment = isGoogleCloudRun() ? 'google-cloud-run' : 'development';
  const availablePaths = Object.keys(STATIC_CONTENT_MAP);
  const pathsWithContent = availablePaths.filter(path => STATIC_CONTENT_MAP[path]);
  const pathsWithoutContent = availablePaths.filter(path => !STATIC_CONTENT_MAP[path]);
  
  return {
    environment,
    isOptimized: isGoogleCloudRun(),
    totalPaths: availablePaths.length,
    pathsWithContent: pathsWithContent.length,
    pathsWithoutContent: pathsWithoutContent.length,
    cacheSize: contentCache.size,
    contentSizes: Object.fromEntries(
      pathsWithContent.map(path => [
        path, 
        (STATIC_CONTENT_MAP[path]?.length / 1024).toFixed(1) + 'KB'
      ])
    ),
    missingContent: pathsWithoutContent,
    detectionMethods: {
      hostname: window.location.hostname,
      hasRunApp: window.location.hostname.includes('.run.app'),
      hasPort: Boolean(process.env.PORT),
      nodeEnv: process.env.NODE_ENV
    }
  };
};

export const validateStaticContent = (): { valid: boolean; missing: string[]; details: any } => {
  const requiredPaths = Object.keys(contentData);
  
  const missing = requiredPaths.filter(path => !STATIC_CONTENT_MAP[path] || STATIC_CONTENT_MAP[path].trim() === '');
  
  return {
    valid: missing.length === 0,
    missing,
    details: getCloudRunOptimizedDebugInfo()
  };
};
