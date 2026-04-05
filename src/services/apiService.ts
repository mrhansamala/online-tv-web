import { Channel, Country } from '../types';

// IPTV-ORG API endpoints
const IPTV_API_BASE = 'https://iptv-org.github.io/api';
const CHANNELS_API = `${IPTV_API_BASE}/channels.json`;
const COUNTRIES_API = `${IPTV_API_BASE}/countries.json`;

export class ApiService {
  private static instance: ApiService;
  private channelsCache: Channel[] = [];
  private countriesCache: Country[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async fetchChannels(): Promise<Channel[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.channelsCache.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.channelsCache;
    }

    try {
      const response = await fetch(CHANNELS_API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawChannels = await response.json();
      
      // Transform API data to our Channel interface
      this.channelsCache = rawChannels
        .filter((channel: any) => channel.name && channel.url)
        .map((channel: any) => ({
          id: channel.id || `${channel.name}-${Date.now()}-${Math.random()}`,
          name: channel.name,
          country: channel.country || 'Unknown',
          category: this.mapCategory(channel.category),
          language: channel.languages?.[0]?.name || 'Unknown',
          logo: channel.logo || '',
          stream_url: channel.url,
          stream_type: this.detectStreamType(channel.url),
          is_working: channel.is_nsfw !== true, // Assume non-NSFW channels are working
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
        .slice(0, 2000); // Limit to 2000 channels for performance

      this.lastFetch = now;
      return this.channelsCache;
    } catch (error) {
      console.error('Failed to fetch channels from API:', error);
      
      // Return mock data as fallback
      return this.generateFallbackChannels();
    }
  }

  async fetchCountries(): Promise<Country[]> {
    if (this.countriesCache.length > 0) {
      return this.countriesCache;
    }

    try {
      const response = await fetch(COUNTRIES_API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawCountries = await response.json();
      
      this.countriesCache = rawCountries.map((country: any) => ({
        code: country.code,
        name: country.name,
        flag: country.flag || this.getCountryFlag(country.code),
        channelCount: 0, // Will be calculated after channels are loaded
        coordinates: {
          lat: this.getCountryCoordinates(country.code).lat,
          lng: this.getCountryCoordinates(country.code).lng,
        },
      }));

      return this.countriesCache;
    } catch (error) {
      console.error('Failed to fetch countries from API:', error);
      return this.generateFallbackCountries();
    }
  }

  private mapCategory(category: string): string {
    if (!category) return 'general';
    
    const categoryMap: { [key: string]: string } = {
      'news': 'news',
      'sport': 'sports',
      'sports': 'sports',
      'movie': 'movies',
      'movies': 'movies',
      'music': 'music',
      'kids': 'kids',
      'children': 'kids',
      'documentary': 'documentary',
      'radio': 'radio',
      'entertainment': 'general',
      'lifestyle': 'general',
      'education': 'documentary',
    };

    const lowerCategory = category.toLowerCase();
    return categoryMap[lowerCategory] || 'general';
  }

  private detectStreamType(url: string): 'hls' | 'mp4' | 'youtube' | 'twitch' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    if (url.includes('twitch.tv')) {
      return 'twitch';
    }
    if (url.includes('.m3u8')) {
      return 'hls';
    }
    if (url.includes('.mp4')) {
      return 'mp4';
    }
    return 'hls'; // Default to HLS
  }

  private getCountryFlag(countryCode: string): string {
    const flagMap: { [key: string]: string } = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸',
      'IT': '🇮🇹', 'RU': '🇷🇺', 'CN': '🇨🇳', 'JP': '🇯🇵', 'IN': '🇮🇳',
      'BR': '🇧🇷', 'AU': '🇦🇺', 'CA': '🇨🇦', 'MX': '🇲🇽', 'AR': '🇦🇷',
      'TR': '🇹🇷', 'EG': '🇪🇬', 'SA': '🇸🇦', 'AE': '🇦🇪', 'ZA': '🇿🇦',
    };
    return flagMap[countryCode] || '🌍';
  }

  private getCountryCoordinates(countryCode: string): { lat: number; lng: number } {
    const coordMap: { [key: string]: { lat: number; lng: number } } = {
      'US': { lat: 39.8283, lng: -98.5795 },
      'GB': { lat: 55.3781, lng: -3.4360 },
      'DE': { lat: 51.1657, lng: 10.4515 },
      'FR': { lat: 46.2276, lng: 2.2137 },
      'ES': { lat: 40.4637, lng: -3.7492 },
      'IT': { lat: 41.8719, lng: 12.5674 },
      'RU': { lat: 61.5240, lng: 105.3188 },
      'CN': { lat: 35.8617, lng: 104.1954 },
      'JP': { lat: 36.2048, lng: 138.2529 },
      'IN': { lat: 20.5937, lng: 78.9629 },
      'BR': { lat: -14.2350, lng: -51.9253 },
      'AU': { lat: -25.2744, lng: 133.7751 },
      'CA': { lat: 56.1304, lng: -106.3468 },
      'MX': { lat: 23.6345, lng: -102.5528 },
      'AR': { lat: -38.4161, lng: -63.6167 },
      'TR': { lat: 38.9637, lng: 35.2433 },
      'EG': { lat: 26.8206, lng: 30.8025 },
      'SA': { lat: 23.8859, lng: 45.0792 },
      'AE': { lat: 23.4241, lng: 53.8478 },
      'ZA': { lat: -30.5595, lng: 22.9375 },
    };
    return coordMap[countryCode] || { lat: 0, lng: 0 };
  }

  private generateFallbackChannels(): Channel[] {
    // Enhanced fallback data with more realistic channels
    const categories = ['news', 'sports', 'movies', 'music', 'kids', 'documentary'];
    const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy'];
    const channels: Channel[] = [];

    countries.forEach((country, countryIndex) => {
      categories.forEach((category, categoryIndex) => {
        for (let i = 0; i < 5; i++) {
          channels.push({
            id: `fallback-${countryIndex}-${categoryIndex}-${i}`,
            name: `${country} ${category.charAt(0).toUpperCase() + category.slice(1)} ${i + 1}`,
            country,
            category,
            language: 'English',
            logo: `https://picsum.photos/seed/${country}${category}${i}/100/100`,
            stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            stream_type: 'mp4',
            is_working: Math.random() > 0.2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      });
    });

    return channels;
  }

  private generateFallbackCountries(): Country[] {
    return [
      { code: 'US', name: 'United States', flag: '🇺🇸', channelCount: 150, coordinates: { lat: 39.8283, lng: -98.5795 } },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', channelCount: 85, coordinates: { lat: 55.3781, lng: -3.4360 } },
      { code: 'DE', name: 'Germany', flag: '🇩🇪', channelCount: 92, coordinates: { lat: 51.1657, lng: 10.4515 } },
      { code: 'FR', name: 'France', flag: '🇫🇷', channelCount: 78, coordinates: { lat: 46.2276, lng: 2.2137 } },
      { code: 'ES', name: 'Spain', flag: '🇪🇸', channelCount: 65, coordinates: { lat: 40.4637, lng: -3.7492 } },
      { code: 'IT', name: 'Italy', flag: '🇮🇹', channelCount: 72, coordinates: { lat: 41.8719, lng: 12.5674 } },
    ];
  }

  updateChannelCounts(channels: Channel[], countries: Country[]): Country[] {
    return countries.map(country => ({
      ...country,
      channelCount: channels.filter(channel => 
        channel.country.toLowerCase() === country.name.toLowerCase()
      ).length
    }));
  }
}

export const apiService = ApiService.getInstance();
