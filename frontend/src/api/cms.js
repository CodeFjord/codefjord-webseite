import axios from 'axios';

// CMS API Client
const cmsApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Error handling interceptor
cmsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('CMS API Error:', error);
    return Promise.reject(error);
  }
);

// Portfolio API
export const portfolioApi = {
  // Get all published portfolio items
  getAll: async () => {
    try {
      const response = await cmsApi.get('/portfolio');
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return [];
    }
  },

  // Get single portfolio item by slug
  getBySlug: async (slug) => {
    try {
      const response = await cmsApi.get(`/portfolio/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      return null;
    }
  },

  // Get single portfolio item by ID
  getById: async (id) => {
    try {
      const response = await cmsApi.get(`/portfolio/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      return null;
    }
  },

  // Get featured portfolio items
  getFeatured: async () => {
    try {
      const response = await cmsApi.get('/portfolio');
      return response.data.filter(item => item.featured === true);
    } catch (error) {
      console.error('Error fetching featured portfolio:', error);
      return [];
    }
  }
};

// Blog API
export const blogApi = {
  // Get all published blog posts
  getAll: async () => {
    try {
      console.log('Fetching blog posts from:', 'https://api.code-fjord.de/api/blog');
      const response = await cmsApi.get('/blog');
      console.log('Raw blog response:', response.data);
      console.log('Total posts found:', response.data.length);
      
      // Log each post's publish status
      response.data.forEach(post => {
        console.log(`Post "${post.title}": published = ${post.published} (type: ${typeof post.published})`);
      });
      
      const publishedPosts = response.data.filter(post => post.published === true);
      console.log('Published posts after filter:', publishedPosts.length);
      console.log('Published posts:', publishedPosts);
      return publishedPosts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      console.error('Error details:', error.response?.data || error.message);
      return [];
    }
  },

  // Get single blog post by slug
  getBySlug: async (slug) => {
    try {
      const response = await cmsApi.get(`/blog/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  },

  // Get recent blog posts (for homepage)
  getRecent: async (limit = 3) => {
    try {
      const posts = await blogApi.getAll();
      return posts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent blog posts:', error);
      return [];
    }
  }
};

// Pages API
export const pagesApi = {
  // Get all published pages
  getAll: async () => {
    try {
      const response = await cmsApi.get('/pages');
      return response.data.filter(page => page.published === true);
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  },

  // Get single page by slug (only published)
  getBySlug: async (slug) => {
    try {
      const response = await cmsApi.get(`/pages/slug/${slug}`);
      const page = response.data;
      
      // Nur veröffentlichte Seiten zurückgeben
      if (page && page.published === true) {
        return page;
      } else {
        console.log(`Page "${slug}" is not published or not found`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }
  }
};

// Media API
export const mediaApi = {
  // Get all media files
  getAll: async () => {
    try {
      const response = await cmsApi.get('/media');
      return response.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      return [];
    }
  },

  // Get media URL
  getUrl: (filename) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4444';
    return `${baseUrl}/uploads/${filename}`;
  }
};

// Contact API
export const contactApi = {
  // Submit contact form
  submit: async (formData) => {
    try {
      const response = await cmsApi.post('/contact', formData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Fehler beim Senden der Nachricht' 
      };
    }
  }
};

// Menu API
export const menuApi = {
  // Get menu by location (public)
  getByLocation: async (location) => {
    try {
      const response = await cmsApi.get(`/menus/location/${location}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${location} menu:`, error);
      return null;
    }
  },

  // Get navbar menu
  getNavbar: async () => {
    return menuApi.getByLocation('navbar');
  },

  // Get footer menu
  getFooter: async () => {
    return menuApi.getByLocation('footer');
  }
};

// Team Members API
export const teamMembersApi = {
  // Get all team members (sorted by order)
  getAll: async () => {
    try {
      const response = await cmsApi.get('/team-members');
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  },

  // Get single team member by ID
  getById: async (id) => {
    try {
      const response = await cmsApi.get(`/team-members/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team member:', error);
      return null;
    }
  }
};

// Home API
export const homeApi = {
  getActive: async () => {
    try {
      const response = await cmsApi.get('/home/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active home data:', error);
      return [];
    }
  }
};

// Website Settings API
export const websiteSettingsApi = {
  // Get public settings (for frontend)
  getPublic: async () => {
    try {
      const response = await cmsApi.get('/website-settings/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching public website settings:', error);
      return {};
    }
  },

  // Get all settings (for admin panel)
  getAll: async () => {
    try {
      const response = await cmsApi.get('/website-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching website settings:', error);
      return {};
    }
  },

  // Update setting
  update: async (key, value, description) => {
    try {
      const response = await cmsApi.post('/website-settings', {
        key,
        value,
        description
      });
      return response.data;
    } catch (error) {
      console.error('Error updating website setting:', error);
      throw error;
    }
  }
};

// Admin API
export const adminApi = {
  // Check admin status
  checkStatus: async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'exists' : 'not found');
      
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Request headers:', headers);
      
      const response = await cmsApi.get('/app/admin-status', { headers });
      console.log('Admin status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      console.error('Error response:', error.response?.data);
      return { isAdmin: false };
    }
  }
};

export default cmsApi; 