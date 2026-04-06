const API_BASE = 'https://iptv-org.github.io/api';

export const fetchAPI = async <T>(endpoint: string): Promise<T[]> => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

export const getChannelLogo = (logos: any[], channelId: string): string | null => {
  const logo = logos.find(l => l.channel === channelId);
  return logo?.url || null;
};

export const getChannelStreams = (streams: any[], channelId: string) => {
  return streams.filter(s => s.channel === channelId && s.url);
};

export const isStreamPlayable = (stream: any): boolean => {
  return stream.url && !stream.url.includes('geo-blocked') && !stream.label?.toLowerCase().includes('geo-blocked');
};