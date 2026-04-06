import { useState, useMemo } from 'react';
import { Search, Filter, Play, Globe, Star, ArrowLeft, Wifi } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Channel, Stream, Logo, Category, Country } from '../types';
import { getChannelLogo, getChannelStreams, isStreamPlayable } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import VideoPlayer from './VideoPlayer';

interface CountryChannelsProps {
  countryCode: string;
  countryName: string;
  onBack: () => void;
}

export default function CountryChannels({ countryCode, countryName, onBack }: CountryChannelsProps) {
  const { data: channels, loading: channelsLoading } = useApi<Channel>('channels');
  const { data: streams, loading: streamsLoading } = useApi<Stream>('streams');
  const { data: logos, loading: logosLoading } = useApi<Logo>('logos');
  const { data: categories, loading: categoriesLoading } = useApi<Category>('categories');
  const { data: countries, loading: countriesLoading } = useApi<Country>('countries');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const loading = channelsLoading || streamsLoading || logosLoading || categoriesLoading || countriesLoading;

  // Filter channels for the specific country
  const countryChannels = useMemo(() => {
    return channels.filter(channel => channel.country === countryCode);
  }, [channels, countryCode]);

  // Filter channels that have playable streams
  const channelsWithStreams = useMemo(() => {
    return countryChannels.filter(channel => {
      const channelStreams = getChannelStreams(streams, channel.id);
      return channelStreams.some(stream => isStreamPlayable(stream));
    });
  }, [countryChannels, streams]);

  const filteredChannels = useMemo(() => {
    return channelsWithStreams.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          channel.alt_names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || channel.categories.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [channelsWithStreams, searchTerm, selectedCategory]);

  const handlePlayChannel = (channel: Channel) => {
    const channelStreams = getChannelStreams(streams, channel.id);
    const playableStreams = channelStreams.filter(isStreamPlayable);
    
    if (playableStreams.length > 0) {
      // Prefer HD streams
      const hdStream = playableStreams.find(s => s.quality?.includes('720') || s.quality?.includes('1080'));
      setSelectedStream(hdStream || playableStreams[0]);
      setShowPlayer(true);
    }
  };

  const country = countries.find(c => c.code === countryCode);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white text-lg mt-4">Loading channels for {countryName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-6xl">{country?.flag || '🌍'}</div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {countryName}
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                {filteredChannels.length} channels available for streaming
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="text-gray-900">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChannels.map((channel) => {
            const logo = getChannelLogo(logos, channel.id);
            const channelStreams = getChannelStreams(streams, channel.id);
            const playableStreams = channelStreams.filter(isStreamPlayable);
            const hasStreams = playableStreams.length > 0;

            return (
              <div
                key={channel.id}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                {/* Channel Image */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                  {logo ? (
                    <img
                      src={logo}
                      alt={channel.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl opacity-20">📺</div>
                    </div>
                  )}
                  
                  {/* Live Indicator */}
                  {hasStreams && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  {hasStreams && (
                    <button
                      onClick={() => handlePlayChannel(channel)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Channel Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {channel.name}
                    </h3>
                    {channel.alt_names.length > 0 && (
                      <p className="text-sm text-gray-400 truncate">{channel.alt_names[0]}</p>
                    )}
                  </div>

                  {/* Network */}
                  {channel.network && (
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{channel.network}</span>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {channel.categories.slice(0, 2).map(categoryId => {
                      const category = categories.find(c => c.id === categoryId);
                      return category ? (
                        <span
                          key={categoryId}
                          className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full"
                        >
                          {category.name}
                        </span>
                      ) : null;
                    })}
                    {channel.categories.length > 2 && (
                      <span className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded-full">
                        +{channel.categories.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Stream Quality */}
                  {hasStreams && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">
                          {playableStreams.length} stream{playableStreams.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {playableStreams.some(s => s.quality) && (
                        <span className="px-2 py-1 bg-green-600/30 text-green-300 text-xs rounded-full">
                          HD
                        </span>
                      )}
                    </div>
                  )}

                  {!hasStreams && (
                    <div className="text-sm text-gray-500 italic">No streams available</div>
                  )}
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none rounded-2xl" />
              </div>
            );
          })}
        </div>

        {filteredChannels.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No channels found</h3>
            <p className="text-gray-400">
              {countryChannels.length === 0 
                ? `No channels available for ${countryName}`
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        )}
      </div>

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