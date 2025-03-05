/**
 * Cloudinary Mock for Testing
 */

// Define types for Cloudinary resources
interface CloudinaryResource {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  resource_type: string;
  tags?: string[];
}

interface CloudinarySearchResult {
  total_count: number;
  resources: CloudinaryResource[];
}

// Create default resources
const defaultResources: CloudinaryResource[] = [
  {
    public_id: 'sample1',
    url: 'http://example.com/sample1.jpg',
    secure_url: 'https://example.com/sample1.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: '2023-01-01T12:00:00Z',
    resource_type: 'image'
  },
  {
    public_id: 'sample2',
    url: 'http://example.com/sample2.jpg',
    secure_url: 'https://example.com/sample2.jpg',
    format: 'jpg',
    width: 1024,
    height: 768,
    created_at: '2023-01-02T12:00:00Z',
    resource_type: 'image'
  }
];

// In-memory store
let resources = [...defaultResources];

// Create the mock
const cloudinaryMock = {
  config: jest.fn().mockReturnValue({}),

  uploader: {
    upload: jest.fn().mockImplementation((file, options = {}) => {
      const newResource: CloudinaryResource = {
        public_id: options.public_id || `upload_${Date.now()}`,
        url: `http://example.com/${options.public_id || `upload_${Date.now()}`}.jpg`,
        secure_url: `https://example.com/${options.public_id || `upload_${Date.now()}`}.jpg`,
        format: 'jpg',
        width: 800,
        height: 600,
        created_at: new Date().toISOString(),
        resource_type: 'image',
        tags: options.tags || []
      };

      resources.push(newResource);
      return Promise.resolve(newResource);
    }),

    destroy: jest.fn().mockImplementation((public_id) => {
      const initialCount = resources.length;
      resources = resources.filter(r => r.public_id !== public_id);
      
      return Promise.resolve({
        result: resources.length < initialCount ? 'ok' : 'not found'
      });
    })
  },

  search: {
    expression: jest.fn().mockImplementation((expression) => {
      // Simple expression parser for resource_type: and tags=
      const filteredResources = resources.filter(r => {
        if (expression.includes('resource_type:')) {
          const match = expression.match(/resource_type:(\w+)/);
          if (match && match[1] && r.resource_type !== match[1]) return false;
        }
        
        if (expression.includes('tags=')) {
          const match = expression.match(/tags=(\w+)/);
          if (match && match[1] && (!r.tags || !r.tags.includes(match[1]))) return false;
        }

        return true;
      });

      return {
        execute: jest.fn().mockResolvedValue({
          total_count: filteredResources.length,
          resources: filteredResources
        } as CloudinarySearchResult),
        sort_by: jest.fn().mockReturnThis(),
        with_field: jest.fn().mockReturnThis(),
        max_results: jest.fn().mockReturnThis()
      };
    })
  },

  url: jest.fn().mockImplementation((publicId, options = {}) => {
    const transformation = options.transformation || '';
    const format = options.format || 'jpg';
    return `https://res.cloudinary.com/demo/${transformation}/${publicId}.${format}`;
  }),

  api: {
    resources: jest.fn().mockResolvedValue({
      resources,
      total_count: resources.length
    }),
    
    resource: jest.fn().mockImplementation((public_id) => {
      const resource = resources.find(r => r.public_id === public_id);
      if (!resource) {
        return Promise.reject(new Error('Resource not found'));
      }
      return Promise.resolve(resource);
    })
  },

  // Test helpers
  __resetResources: () => {
    resources = [...defaultResources];
  },

  __setResources: (newResources: CloudinaryResource[]) => {
    resources = [...newResources];
  },

  __addResource: (resource: CloudinaryResource) => {
    resources.push(resource);
  }
};

export default cloudinaryMock;