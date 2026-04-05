import { create } from 'zustand';
import { Channel, Country, User } from '../types';

interface AppStore {
  // UI State
  isDarkMode: boolean;
  isGlobeLoaded: boolean;
  selectedCountry: string | null;
  currentChannel: Channel | null;
  isPlaying: boolean;
  
  // Data
  channels: Channel[];
  countries: Country[];
  filteredChannels: Channel[];
  favorites: string[];
  
  // User
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setDarkMode: (dark: boolean) => void;
  setGlobeLoaded: (loaded: boolean) => void;
  setSelectedCountry: (country: string | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setChannels: (channels: Channel[]) => void;
  setCountries: (countries: Country[]) => void;
  setFilteredChannels: (channels: Channel[]) => void;
  addToFavorites: (channelId: string) => void;
  removeFromFavorites: (channelId: string) => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  
  // Filters
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Initial state
  isDarkMode: true,
  isGlobeLoaded: false,
  selectedCountry: null,
  currentChannel: null,
  isPlaying: false,
  channels: [],
  countries: [],
  filteredChannels: [],
  favorites: [],
  user: null,
  isAuthenticated: false,
  searchTerm: '',
  selectedCategory: 'all',

  // Actions
  setDarkMode: (dark) => set({ isDarkMode: dark }),
  setGlobeLoaded: (loaded) => set({ isGlobeLoaded: loaded }),
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setChannels: (channels) => set({ channels }),
  setCountries: (countries) => set({ countries }),
  setFilteredChannels: (channels) => set({ filteredChannels: channels }),
  addToFavorites: (channelId) => {
    const { favorites } = get();
    if (!favorites.includes(channelId)) {
      set({ favorites: [...favorites, channelId] });
    }
  },
  removeFromFavorites: (channelId) => {
    const { favorites } = get();
    set({ favorites: favorites.filter(id => id !== channelId) });
  },
  setUser: (user) => set({ user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
