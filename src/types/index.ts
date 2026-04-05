export interface Channel {
  id: string;
  name: string;
  country: string;
  category: string;
  language: string;
  logo?: string;
  stream_url: string;
  stream_type: 'hls' | 'mp4' | 'youtube' | 'twitch';
  is_working: boolean;
  created_at: string;
  updated_at: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  channelCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  favorites: string[];
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
