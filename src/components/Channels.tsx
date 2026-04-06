import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Play, Globe, Star, Clock, Wifi, Tv, ExternalLink } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Channel, Stream, Logo, Category, Country } from '../types';
import { 
  getChannelLogo, 
  getChannelStreams, 
  isStreamPlayable,
  fetchPeoLiveStream, // නව API එක සඳහා
  fetchPeoCatchup 
} from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import VideoPlayer from './VideoPlayer';

/**
 * PEO API එකෙන් ලැබෙන දත්ත වලට ගැලපෙන interfaces
 */
interface PeoStream {
  name: string;
  url: string;
  logo?: string;
}

export default function Channels() {
  // IPTV-ORG දත්ත
  const { data: channels, loading: channelsLoading } = useApi<Channel>('channels');
  const { data: streams, loading: streamsLoading } = useApi<Stream>('streams');
  const { data: logos, loading: logosLoading } = useApi<Logo>('logos');
  const { data: categories, loading: categoriesLoading } = useApi<Category>('categories');
  const { data: countries, loading: countriesLoading } = useApi<Country>('countries');

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('LK'); // Default as Sri Lanka
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStream, setSelectedStream] = useState<Stream | any>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [peoLiveLinks, setPeoLiveLinks] = useState<Record<string, string>>({});

  const loading = channelsLoading || streamsLoading || logosLoading || categoriesLoading || countriesLoading;

  /**
   * ශ්‍රී ලංකාවේ චැනල් සඳහා විශේෂයෙන් Live links ලබා ගැනීම (Peo API)
   */
  useEffect(() => {
    const loadLankanLiveLinks = async () => {
      const lankanChannels = ['swarnavahini', 'sirasa', 'itn', 'derana', 'tv-derana', 'hiru-tv', 'shakthi-tv'];
      const links: Record<string, string> = {};
      
      for (const ch of lankanChannels) {
        try {
          const data = await fetchPeoLiveStream(ch);
          if (data && data.url) {
            links[ch] = data.url;
          }
        } catch (e) {
          console.error("Link fetch error:", ch);
        }
      }
      setPeoLiveLinks(links);
    };

    if (!loading) {
      loadLankanLiveLinks();
    }
  }, [loading]);

  /**
   * Playable streams ඇති චැනල් සහ ශ්‍රී ලංකාවට ප්‍රමුඛතාවය දීම
   */
  const processedChannels = useMemo(() => {
    // 1. Playable දත්ත ඇති චැනල් වෙන් කිරීම
    const baseChannels = channels.filter(channel => {
      const channelStreams = getChannelStreams(streams, channel.id);
      return channelStreams.some(stream => isStreamPlayable(stream)) || channel.country === 'LK';
    });

    // 2. ශ්‍රී ලංකාවේ චැනල් මුලට ගෙන ඒම
    return [...baseChannels].sort((a, b) => {
      if (a.country === 'LK' && b.country !== 'LK') return -1;
      if (a.country !== 'LK' && b.country === 'LK') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [channels, streams]);

  /**
   * Search සහ Filter ක්‍රියාත්මක කිරීම
   */
  const filteredChannels = useMemo(() => {
    return processedChannels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            channel.alt_names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || channel.categories.includes(selectedCategory);
      const matchesCountry = !selectedCountry || channel.country === selectedCountry;
      
      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [processedChannels, searchTerm, selectedCategory, selectedCountry]);

  /**
   * චැනල් එකක් Play කිරීමට උත්සාහ කරන විට
   */
  const handlePlayChannel = async (channel: Channel) => {
    // පළමුව PEO API එකේ link එකක් තිබේදැයි බලයි (ලංකාවේ චැනල් සඳහා)
    const peoKey = channel.id.split('.')[0].toLowerCase();
    if (peoLiveLinks[peoKey]) {
      setSelectedStream({
        url: peoLiveLinks[peoKey],
        channel: channel.id,
        quality: 'HD (Auto)'
      });
      setShowPlayer(true);
      return;
    }

    // IPTV-ORG streams පරීක්ෂා කිරීම
    const channelStreams = getChannelStreams(streams, channel.id);
    const playableStreams = channelStreams.filter(isStreamPlayable);
    
    if (playableStreams.length > 0) {
      const hdStream = playableStreams.find(s => s.quality?.includes('720') || s.quality?.includes('1080'));
      setSelectedStream(hdStream || playableStreams[0]);
      setShowPlayer(true);
    } else {
      alert("දැනට මෙම නාලිකාව විකාශනය කළ නොහැක.");
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country?.flag || '🌍';
  };

  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country?.name || countryCode;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-blue-400 font-medium text-lg mt-4 animate-pulse">Loading Sri Lankan & International Channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Live Stream Hub
              </span>
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-500" />
              {filteredChannels.length} Channels found | High Quality VERTEX.TV
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-emerald-400 text-sm font-bold uppercase">System Online</span>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 mb-10 border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name (e.g. Swarnavahini, HBO)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Content Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Genres</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Region / Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Global (All Countries)</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={() => { setSelectedCountry('LK'); setSelectedCategory(''); setSearchTerm(''); }}
                  className="w-full py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-xl hover:bg-emerald-600/30 transition-colors font-bold"
                >
                  Reset to Sri Lanka 🇱🇰
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredChannels.map((channel) => {
            const logo = getChannelLogo(logos, channel.id);
            const channelStreams = getChannelStreams(streams, channel.id);
            const playableStreams = channelStreams.filter(isStreamPlayable);
            const hasStreams = playableStreams.length > 0 || !!peoLiveLinks[channel.id.split('.')[0].toLowerCase()];
            const isLankan = channel.country === 'LK';

            return (
              <div
                key={channel.id}
                className={`group relative flex flex-col bg-gray-800/40 border ${
                  isLankan ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5'
                } rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2`}
              >
                {/* Image Wrapper */}
                <div className="relative h-44 bg-gray-950 flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {logo ? (
                    <img
                      src={logo}
                      alt={channel.name}
                      className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">📺</div>
                  )}

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isLankan && (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg">LANKAN</span>
                    )}
                    {hasStreams && (
                      <div className="flex items-center gap-1.5 bg-red-600 px-2 py-1 rounded text-[10px] font-bold text-white shadow-xl">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                  </div>

                  {/* Quick Play Overlay */}
                  {hasStreams && (
                    <button
                      onClick={() => handlePlayChannel(channel)}
                      className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="fill-current w-6 h-6 ml-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-white truncate leading-tight group-hover:text-blue-400 transition-colors">
                        {channel.name}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <span>{getCountryFlag(channel.country)}</span>
                        {getCountryName(channel.country)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {channel.categories.slice(0, 1).map(catId => {
                      const cat = categories.find(c => c.id === catId);
                      return cat ? (
                        <span key={catId} className="text-[10px] font-bold py-1 px-2 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 uppercase tracking-tighter">
                          {cat.name}
                        </span>
                      ) : null;
                    })}
                    {channel.network && (
                      <span className="text-[10px] font-bold py-1 px-2 bg-gray-700/50 text-gray-400 rounded-md uppercase tracking-tighter">
                        {channel.network}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Wifi className={`w-3.5 h-3.5 ${hasStreams ? 'text-emerald-500' : 'text-gray-600'}`} />
                      <span className="text-[11px] font-medium text-gray-400">
                        {hasStreams ? 'Streams Available' : 'Offline'}
                      </span>
                    </div>
                    <button 
                      onClick={() => handlePlayChannel(channel)}
                      disabled={!hasStreams}
                      className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredChannels.length === 0 && (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="inline-block p-6 bg-gray-900 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">නාලිකා හමුවුනේ නැත</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              ඔබ සොයන නාමය නිවැරදිදැයි පරීක්ෂා කරන්න, නැතහොත් Filters වෙනස් කර නැවත උත්සාහ කරන්න.
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto mt-20 pb-10 border-t border-white/5 pt-10 text-center">
        <p className="text-gray-600 text-sm">
          © 2026 LiveHub VERTEX.TV. Optimized for Sri Lankan Networks. 🇱🇰
        </p>
      </footer>

      {/* Video Player Modal */}
      {selectedStream && (
        <VideoPlayer
          stream={selectedStream}
          isOpen={showPlayer}
          onClose={() => {
            setShowPlayer(false);
            setSelectedStream(null);
          }}
        />
      )}
    </div>
  );
}
