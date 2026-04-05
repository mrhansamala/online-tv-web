import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Filter, Globe, Tv, Radio, Film, Gamepad2, Baby, BookOpen, Music, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Channel } from '../types';

export const ChannelSidebar = () => {
  const {
    selectedCountry,
    channels,
    filteredChannels,
    setFilteredChannels,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    favorites,
    addToFavorites,
    removeFromFavorites,
    setCurrentChannel,
    currentChannel
  } = useStore();

  const [showCategories, setShowCategories] = useState(false);

  const categories = [
    { value: 'all', label: 'All Channels', icon: Globe },
    { value: 'news', label: 'News', icon: Tv },
    { value: 'sports', label: 'Sports', icon: Gamepad2 },
    { value: 'movies', label: 'Movies', icon: Film },
    { value: 'music', label: 'Music', icon: Music },
    { value: 'kids', label: 'Kids', icon: Baby },
    { value: 'documentary', label: 'Documentary', icon: BookOpen },
    { value: 'radio', label: 'Radio', icon: Radio },
  ];

  useEffect(() => {
    filterChannels();
  }, [channels, selectedCountry, searchTerm, selectedCategory]);

  const filterChannels = () => {
    let filtered = channels;

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter(channel => 
        channel.country.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(channel => 
        channel.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.language.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChannels(filtered);
  };

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel);
  };

  const toggleFavorite = (channelId: string) => {
    if (favorites.includes(channelId)) {
      removeFromFavorites(channelId);
    } else {
      addToFavorites(channelId);
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700 flex flex-col lg:border-r lg:border-t-0 border-t"
    >
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg lg:text-xl font-bold text-white">
            {selectedCountry ? `${selectedCountry} TV` : 'Global TV'}
          </h2>
        </div>

        {/* Search */}
        <div className="relative mb-3 lg:mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search channels..."
            className="w-full pl-10 pr-4 py-2 text-sm lg:text-base bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-between px-3 lg:px-4 py-2 text-sm lg:text-base bg-slate-800 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>{categories.find(cat => cat.value === selectedCategory)?.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showCategories && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-20"
              >
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setShowCategories(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base text-left hover:bg-slate-700 transition-colors ${
                        selectedCategory === category.value ? 'bg-slate-700 text-cyan-400' : 'text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-2">
        <AnimatePresence>
          {filteredChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                currentChannel?.id === channel.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                  : 'bg-slate-800 hover:bg-slate-700'
              } transition-all duration-200`}
              onClick={() => handleChannelSelect(channel)}
            >
              <div className="p-2 lg:p-3">
                <div className="flex items-center space-x-3">
                  {/* Channel Logo */}
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tv className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Channel Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm lg:text-base text-white font-medium truncate">
                      {channel.name}
                    </h3>
                    <p className="text-gray-300 text-xs lg:text-sm">
                      {channel.category} • {channel.language}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        channel.is_working ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className="text-xs text-gray-400">
                        {channel.is_working ? 'Live' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(channel.id);
                    }}
                    className="p-1 lg:p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 lg:w-5 lg:h-5 ${
                        favorites.includes(channel.id)
                          ? 'text-red-400 fill-red-400'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredChannels.length === 0 && (
          <div className="text-center py-8">
            <Tv className="w-8 h-8 lg:w-12 lg:h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-base lg:text-lg font-medium text-white mb-1">No Channels Found</h3>
            <p className="text-sm lg:text-base text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-3 lg:p-4 border-t border-slate-700">
        <div className="text-center">
          <p className="text-xs lg:text-sm text-gray-400">
            Showing {filteredChannels.length} of {channels.length} channels
          </p>
        </div>
      </div>
    </motion.div>
  );
};