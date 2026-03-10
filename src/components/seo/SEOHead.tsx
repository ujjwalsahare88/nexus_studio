import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { photographerInfo } from '@/data/photographer';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

/**
 * SEO component for managing page meta tags
 * Handles title, description, and Open Graph tags
 */
export function SEOHead({ 
  title, 
  description, 
  // Photo by Oyemike Princewill on Unsplash
  image = 'https://images.unsplash.com/photo-1662333085102-f6ae3be21c91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDA2OTF8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NjI3Njk1NjB8&ixlib=rb-4.1.0&q=80&w=1080',
  type = 'website'
}: SEOHeadProps) {
  const location = useLocation();
  
  const fullTitle = title 
    ? `${title} | ${photographerInfo.name}` 
    : `${photographerInfo.name} - ${photographerInfo.tagline}`;
  
  const defaultDescription = photographerInfo.heroIntroduction;
  const fullDescription = description || defaultDescription;
  
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', fullDescription);
    
    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', fullDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', photographerInfo.name, true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', fullDescription);
    updateMetaTag('twitter:image', image);

    // Additional SEO tags
    updateMetaTag('author', photographerInfo.name);
    updateMetaTag('keywords', `photography, ${photographerInfo.name}, professional photographer, ${photographerInfo.tagline}`);
  }, [fullTitle, fullDescription, fullUrl, image, type]);

  return null;
}
