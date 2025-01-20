import { useState } from 'react';

export type Page = 'home' | 'second' | 'gallery';

export const usePage = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  return { currentPage, setCurrentPage };
};
