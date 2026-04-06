import { useState, useEffect, useMemo } from 'react';
import { 
  Home, Tv, Radio, Image, Play, BookOpen, 
  Tag, Globe, MapPin, Building2, Clock, 
  Shield, Menu, X, ChevronDown, ChevronRight,
  Search, Filter
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Country, Channel } from '../types';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCountryChannels: (countryCode: string, countryName: string) => void;
}

const mainMenuItems = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'channels', name: 'All Channels', icon: Tv },
 // { id: 'feeds', name: 'Feeds', icon: Radio },
 // { id: 'logos', name: 'Logos', icon: Image },
  //{ id: 'streams', name: 'Streams', icon: Play },
 // { id: 'guides', name: 'Guides', icon: BookOpen },
 // { id: 'categories', name: 'Categories', icon: Tag },
//  { id: 'languages', name: 'Languages', icon: Globe },
 // { id: 'subdivisions', name: 'Subdivisions', icon: Building2 },
  { id: 'cities', name: 'Cities', icon: Building2 },
  { id: 'regions', name: 'Regions', icon: MapPin },
  { id: 'timezones', name: 'Timezones', icon: Clock },
  { id: 'blocklist', name: 'Blocklist', icon: Shield },
];

export default function Navigation({ activeSection, onSectionChange, onCountryChannels }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: countries } = useApi<Country>('countries');
  const { data: channels } = useApi<Channel>('channels');

  // Group channels by country and count them
  const countryChannels = useMemo(() => {
    const grouped = new Map<string, number>();
    channels.forEach(channel => {
      const count = grouped.get(channel.country) || 0;
      grouped.set(channel.country, count + 1);
    });
    return grouped;
  }, [channels]);

  // Filter countries based on search and available channels
  const filteredCountries = useMemo(() => {
    return countries
      .filter(country => {
        const hasChannels = countryChannels.has(country.code);
        const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            country.code.toLowerCase().includes(searchTerm.toLowerCase());
        return hasChannels && matchesSearch;
      })
      .sort((a, b) => {
        const aCount = countryChannels.get(a.code) || 0;
        const bCount = countryChannels.get(b.code) || 0;
        return bCount - aCount; // Sort by channel count descending
      });
  }, [countries, countryChannels, searchTerm]);

  const toggleCountry = (countryCode: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(countryCode)) {
      newExpanded.delete(countryCode);
    } else {
      newExpanded.add(countryCode);
    }
    setExpandedCountries(newExpanded);
  };

  const handleCountryChannelClick = (countryCode: string, countryName: string) => {
    onCountryChannels(countryCode, countryName);
    setIsOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600/90 backdrop-blur-sm text-white p-3 rounded-xl shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-lg text-white z-40 transform transition-transform duration-300 overflow-hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Tv className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  VERTEX.TV Hub
                </h1>
                <p className="text-sm text-gray-400">Global Streaming</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Main Menu */}
            <div className="p-4">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3 px-2">Main Menu</h3>
              <nav className="space-y-1">
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Countries Section */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 px-2">Countries</h3>
                <span className="text-xs text-gray-500">{filteredCountries.length}</span>
              </div>
              
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Countries List */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredCountries.map((country) => {
                  const channelCount = countryChannels.get(country.code) || 0;
                  const isExpanded = expandedCountries.has(country.code);
                  
                  return (
                    <div key={country.code} className="space-y-1">
                      {/* Country Header */}
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleCountry(country.code)}
                          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm font-medium text-gray-300 truncate group-hover:text-white">
                              {country.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                              {channelCount}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="ml-6 space-y-1 animate-fadeIn">
                          <button
                            onClick={() => handleCountryChannelClick(country.code, country.name)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-600/20 hover:text-purple-300 transition-colors duration-200 text-sm text-gray-400"
                          >
                            <Tv className="w-4 h-4" />
                            <span>View All Channels</span>
                            <span className="ml-auto text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full">
                              {channelCount}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredCountries.length === 0 && searchTerm && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No countries found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
        />
      )}
    </>
  );
}
