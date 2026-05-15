import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

export const useSEO = (meta: SEOMetaData) => {
  const route = useRoute();

  const updateMetaTags = () => {
    // Update title
    if (meta.title) {
      document.title = `${meta.title} | International Student Compass`;
    }

    // Update or create meta tags
    const metaTags = [
      { name: 'description', content: meta.description || '' },
      { name: 'keywords', content: meta.keywords || '' },
      { name: 'author', content: meta.author || 'International Student Compass' },

      // Open Graph
      { property: 'og:title', content: meta.title || '' },
      { property: 'og:description', content: meta.description || '' },
      { property: 'og:image', content: meta.image || 'https://students-platform.com/og-image.jpg' },
      { property: 'og:url', content: meta.url || window.location.href },
      { property: 'og:type', content: meta.type || 'website' },

      // Twitter
      { name: 'twitter:title', content: meta.title || '' },
      { name: 'twitter:description', content: meta.description || '' },
      { name: 'twitter:image', content: meta.image || 'https://students-platform.com/og-image.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;

      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.url || window.location.href);
  };

  onMounted(() => {
    updateMetaTags();
  });

  watch(() => route.path, () => {
    updateMetaTags();
  });

  return {
    updateMetaTags,
  };
};

// Pre-defined SEO configs for common pages
export const SEOConfigs = {
  home: {
    title: 'Home',
    description: 'Connect with international students worldwide. Share experiences, find communities, and access resources.',
    keywords: 'international students, student community, study abroad, student networking',
  },
  login: {
    title: 'Login',
    description: 'Login to International Student Compass to connect with students worldwide.',
    keywords: 'student login, international student platform',
  },
  register: {
    title: 'Sign Up',
    description: 'Join International Student Compass and connect with students from around the world.',
    keywords: 'student registration, join student community',
  },
  profile: {
    title: 'Profile',
    description: 'View and manage your International Student Compass profile.',
    keywords: 'student profile, user profile',
  },
  communities: {
    title: 'Communities',
    description: 'Explore and join student communities based on your interests and location.',
    keywords: 'student communities, student groups, university communities',
  },
  messages: {
    title: 'Messages',
    description: 'Connect and chat with other international students.',
    keywords: 'student chat, student messages, connect students',
  },
};
