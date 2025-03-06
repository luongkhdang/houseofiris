import { Photo } from './services/photoService';

// Placeholder photos for development and testing
export const placeholderPhotos: Photo[] = [
  {
    url: 'https://res.cloudinary.com/dvmpwccjw/image/upload/v1708123456/sample1.jpg',
    public_id: 'sample1',
    created_at: '2023-01-01T12:00:00Z',
    title: 'Summer Vacation',
    description: 'A beautiful day at the beach',
    location: 'Malibu, CA',
  },
  {
    url: 'https://res.cloudinary.com/dvmpwccjw/image/upload/v1708123457/sample2.jpg',
    public_id: 'sample2',
    created_at: '2023-02-15T14:30:00Z',
    title: 'Mountain Hike',
    description: 'Breathtaking views from the summit',
    location: 'Rocky Mountains',
  },
  {
    url: 'https://res.cloudinary.com/dvmpwccjw/image/upload/v1708123458/sample3.jpg',
    public_id: 'sample3',
    created_at: '2023-03-20T09:15:00Z',
    title: 'City Lights',
    description: 'Downtown at night',
    location: 'New York City',
  },
];
