import { Channel, Country } from '../types';

export const mockCountries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', channelCount: 1250, coordinates: { lat: 39.8283, lng: -98.5795 } },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', channelCount: 850, coordinates: { lat: 55.3781, lng: -3.4360 } },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', channelCount: 920, coordinates: { lat: 51.1657, lng: 10.4515 } },
  { code: 'FR', name: 'France', flag: '🇫🇷', channelCount: 780, coordinates: { lat: 46.2276, lng: 2.2137 } },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', channelCount: 650, coordinates: { lat: 40.4637, lng: -3.7492 } },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', channelCount: 720, coordinates: { lat: 41.8719, lng: 12.5674 } },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', channelCount: 1100, coordinates: { lat: 61.5240, lng: 105.3188 } },
  { code: 'CN', name: 'China', flag: '🇨🇳', channelCount: 2200, coordinates: { lat: 35.8617, lng: 104.1954 } },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', channelCount: 980, coordinates: { lat: 36.2048, lng: 138.2529 } },
  { code: 'IN', name: 'India', flag: '🇮🇳', channelCount: 1800, coordinates: { lat: 20.5937, lng: 78.9629 } },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', channelCount: 890, coordinates: { lat: -14.2350, lng: -51.9253 } },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', channelCount: 420, coordinates: { lat: -25.2744, lng: 133.7751 } },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', channelCount: 680, coordinates: { lat: 56.1304, lng: -106.3468 } },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', channelCount: 520, coordinates: { lat: 23.6345, lng: -102.5528 } },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', channelCount: 380, coordinates: { lat: -38.4161, lng: -63.6167 } },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', channelCount: 450, coordinates: { lat: 38.9637, lng: 35.2433 } },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', channelCount: 320, coordinates: { lat: 26.8206, lng: 30.8025 } },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', channelCount: 280, coordinates: { lat: 23.8859, lng: 45.0792 } },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', channelCount: 240, coordinates: { lat: 23.4241, lng: 53.8478 } },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', channelCount: 350, coordinates: { lat: -30.5595, lng: 22.9375 } },
];

export const generateMockChannels = (): Channel[] => {
  const categories = ['news', 'sports', 'movies', 'music', 'kids', 'documentary', 'radio'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Russian', 'Chinese', 'Arabic', 'Portuguese'];
  
  const channelNames = {
    news: ['Global News', 'World Report', 'Breaking News', 'News Central', 'Live Updates'],
    sports: ['Sports Center', 'Live Sports', 'Championship', 'Sports World', 'Athletic TV'],
    movies: ['Cinema Plus', 'Movie Theater', 'Film Central', 'Hollywood', 'Blockbuster'],
    music: ['Music TV', 'Hit Radio', 'Sound Wave', 'Melody', 'Rhythm'],
    kids: ['Kids Zone', 'Cartoon Network', 'Fun Time', 'Children TV', 'Little Stars'],
    documentary: ['Discovery', 'Nature World', 'Science Channel', 'History', 'Explorer'],
    radio: ['Radio Wave', 'Music Station', 'Talk Radio', 'Classic FM', 'Pop Radio']
  };
  
  const channels: Channel[] = [];
  
  mockCountries.forEach((country) => {
    const channelCount = Math.min(Math.floor(country.channelCount * 0.05), 15); // Generate 5% of the total for demo, max 15 per country
    
    for (let i = 0; i < channelCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const language = languages[Math.floor(Math.random() * languages.length)];
      const categoryNames = channelNames[category as keyof typeof channelNames];
      const baseName = categoryNames[Math.floor(Math.random() * categoryNames.length)];
      
      channels.push({
        id: `${country.code}-${i}-${Date.now()}`,
        name: `${country.name} ${baseName}`,
        country: country.name,
        category,
        language,
        logo: `https://picsum.photos/seed/${country.code}${category}${i}/100/100`,
        stream_url: `https://demo-streams.com/${country.code}/${category}/${i}.m3u8`,
        stream_type: 'hls',
        is_working: Math.random() > 0.2, // 80% working channels
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  });
  
  return channels;
};
