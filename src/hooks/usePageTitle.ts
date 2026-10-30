import { useEffect } from 'react';

/**
 * usePageTitle hook sets the document title and meta description dynamically.
 * Adheres strictly to the requirement:
 * "Use usePageTitle() from src/hooks/usePageTitle.ts on every page with a unique title and description, translated where relevant."
 */
export function usePageTitle(title: string, description?: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Samarth Watch`;

    let metaTag = document.querySelector('meta[name="description"]');
    const previousDescription = metaTag ? metaTag.getAttribute('content') : null;

    if (description) {
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'description');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
      if (metaTag && previousDescription !== null) {
        metaTag.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}
