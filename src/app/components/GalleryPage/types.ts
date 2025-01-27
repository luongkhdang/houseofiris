export type Photo = {
    url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    created_at: string;
    title?: string; // Optional property
    date?: string;  // Optional property
    location?: string; // Optional property
  };
  