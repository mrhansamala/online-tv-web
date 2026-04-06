import { useState } from 'react';
import { 
  Radio, Image, Play, BookOpen, Tag, Globe, MapPin, 
  Building2, Clock, Shield 
} from 'lucide-react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Channels from './components/Channels';
import CountryChannels from './components/CountryChannels';
import DataBrowser from './components/DataBrowser';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCountry, setSelectedCountry] = useState<{code: string, name: string} | null>(null);

  const handleCountryChannels = (countryCode: string, countryName: string) => {
    setSelectedCountry({ code: countryCode, name: countryName });
    setActiveSection('country-channels');
  };

  const handleBackFromCountry = () => {
    setSelectedCountry(null);
    setActiveSection('home');
  };

  const renderContent = () => {
    if (activeSection === 'country-channels' && selectedCountry) {
      return (
        <CountryChannels
          countryCode={selectedCountry.code}
          countryName={selectedCountry.name}
          onBack={handleBackFromCountry}
        />
      );
    }

    switch (activeSection) {
      case 'home':
        return <Home />;
      
      case 'channels':
        return <Channels />;
        
      case 'feeds':
        return (
          <DataBrowser
            title="TV Feeds"
            endpoint="feeds"
            icon={<Radio className="w-8 h-8 text-white" />}
            description="Explore regional TV feeds and broadcasting areas"
            renderCard={(feed) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-3 mb-4">
                  <Radio className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{feed.name}</h3>
                    <p className="text-sm text-gray-400">Channel: {feed.channel}</p>
                  </div>
                </div>
                
                {feed.is_main && (
                  <span className="px-2 py-1 bg-green-600/30 text-green-300 text-xs rounded-full mb-3 inline-block">
                    Main Feed
                  </span>
                )}
                
                <div className="space-y-2 text-sm text-gray-300">
                  {feed.languages.length > 0 && (
                    <div>Languages: {feed.languages.join(', ')}</div>
                  )}
                  {feed.format && (
                    <div>Format: <span className="text-blue-400">{feed.format}</span></div>
                  )}
                  {feed.broadcast_area.length > 0 && (
                    <div className="text-xs text-gray-400">
                      Broadcast: {feed.broadcast_area.slice(0, 2).join(', ')}
                      {feed.broadcast_area.length > 2 && ` +${feed.broadcast_area.length - 2} more`}
                    </div>
                  )}
                </div>
              </div>
            )}
          />
        );
        
      case 'logos':
        return (
          <DataBrowser
            title="Channel Logos"
            endpoint="logos"
            icon={<Image className="w-8 h-8 text-white" />}
            description="Browse and preview channel logos and branding assets"
            renderCard={(logo) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  <img
                    src={logo.url}
                    alt={`Logo for ${logo.channel}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-white text-sm truncate mb-2">{logo.channel}</h3>
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {logo.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">
                    {logo.width}×{logo.height} • {logo.format || 'Unknown'}
                  </div>
                </div>
              </div>
            )}
          />
        );
        
      case 'streams':
        return (
          <DataBrowser
            title="Live Streams"
            endpoint="streams"
            icon={<Play className="w-8 h-8 text-white" />}
            description="Discover available live streams and their technical details"
            renderCard={(stream) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{stream.title}</h3>
                    {stream.channel && (
                      <p className="text-sm text-gray-400">Channel: {stream.channel}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {stream.quality && (
                    <span className="px-2 py-1 bg-green-600/30 text-green-300 text-xs rounded-full">
                      {stream.quality}
                    </span>
                  )}
                  
                  {stream.label && (
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-yellow-600/30 text-yellow-300 text-xs rounded-full">
                        {stream.label}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 break-all">
                    {stream.url.substring(0, 60)}...
                  </div>
                </div>
              </div>
            )}
          />
        );
        
      case 'guides':
        return (
          <DataBrowser
            title="TV Guides"
            endpoint="guides"
            icon={<BookOpen className="w-8 h-8 text-white" />}
            description="Electronic Program Guide (EPG) information for channels"
            renderCard={(guide) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{guide.site_name}</h3>
                    <p className="text-sm text-gray-400">Site: {guide.site}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  {guide.channel && <div>Channel: {guide.channel}</div>}
                  {guide.site_id && <div>Site ID: <span className="text-blue-400">{guide.site_id}</span></div>}
                  <div className="flex items-center gap-2">
                    <span>Language:</span>
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full uppercase">
                      {guide.lang}
                    </span>
                  </div>
                </div>
              </div>
            )}
          />
        );
        
      case 'categories':
        return (
          <DataBrowser
            title="Categories"
            endpoint="categories"
            icon={<Tag className="w-8 h-8 text-white" />}
            description="Browse content categories and genres"
            renderCard={(category) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{category.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{category.description}</p>
                </div>
              </div>
            )}
          />
        );
        
      case 'languages':
        return (
          <DataBrowser
            title="Languages"
            endpoint="languages"
            icon={<Globe className="w-8 h-8 text-white" />}
            description="Supported languages for international content"
            renderCard={(language) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{language.name}</h3>
                  <span className="px-3 py-1 bg-blue-600/30 text-blue-300 text-sm rounded-full uppercase font-mono">
                    {language.code}
                  </span>
                </div>
              </div>
            )}
          />
        );
        
      case 'countries':
        return (
          <DataBrowser
            title="Countries"
            endpoint="countries"
            icon={<MapPin className="w-8 h-8 text-white" />}
            description="Countries with available TV channels and content"
            renderCard={(country) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-6xl mb-4">{country.flag}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{country.name}</h3>
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-purple-600/30 text-purple-300 text-sm rounded-full uppercase font-mono">
                      {country.code}
                    </span>
                    {country.languages.length > 0 && (
                      <div className="text-sm text-gray-300">
                        Languages: {country.languages.join(', ').toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        );
        
      case 'subdivisions':
        return (
          <DataBrowser
            title="Subdivisions"
            endpoint="subdivisions"
            icon={<Building2 className="w-8 h-8 text-white" />}
            description="Regional subdivisions and administrative areas"
            renderCard={(subdivision) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{subdivision.name}</h3>
                    <p className="text-sm text-gray-400">Country: {subdivision.country}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Code: <span className="text-blue-400 font-mono">{subdivision.code}</span></div>
                  {subdivision.parent && (
                    <div>Parent: <span className="text-purple-400">{subdivision.parent}</span></div>
                  )}
                </div>
              </div>
            )}
          />
        );
        
      case 'cities':
        return (
          <DataBrowser
            title="Cities"
            endpoint="cities"
            icon={<Building2 className="w-8 h-8 text-white" />}
            description="Cities with local broadcasting and content"
            renderCard={(city) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{city.name}</h3>
                    <p className="text-sm text-gray-400">Country: {city.country}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Code: <span className="text-blue-400 font-mono">{city.code}</span></div>
                  {city.subdivision && (
                    <div>Subdivision: <span className="text-purple-400">{city.subdivision}</span></div>
                  )}
                  {city.wikidata_id && (
                    <div className="text-xs text-gray-400">Wikidata: {city.wikidata_id}</div>
                  )}
                </div>
              </div>
            )}
          />
        );
        
      case 'regions':
        return (
          <DataBrowser
            title="Regions"
            endpoint="regions"
            icon={<MapPin className="w-8 h-8 text-white" />}
            description="Geographic regions and country groupings"
            renderCard={(region) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{region.name}</h3>
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-purple-600/30 text-purple-300 text-sm rounded-full uppercase font-mono">
                      {region.code}
                    </span>
                    <div className="text-sm text-gray-300">
                      {region.countries.length} Countries: {region.countries.slice(0, 3).join(', ')}
                      {region.countries.length > 3 && ` +${region.countries.length - 3} more`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        );
        
      case 'timezones':
        return (
          <DataBrowser
            title="Timezones"
            endpoint="timezones"
            icon={<Clock className="w-8 h-8 text-white" />}
            description="Time zones for international broadcasting schedules"
            renderCard={(timezone) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-mono">{timezone.id}</h3>
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-green-600/30 text-green-300 text-lg rounded-full font-mono">
                      UTC{timezone.utc_offset}
                    </span>
                    <div className="text-sm text-gray-300">
                      {timezone.countries.length} Countries: {timezone.countries.slice(0, 2).join(', ')}
                      {timezone.countries.length > 2 && ` +${timezone.countries.length - 2} more`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        );
        
      case 'blocklist':
        return (
          <DataBrowser
            title="Blocklist"
            endpoint="blocklist"
            icon={<Shield className="w-8 h-8 text-white" />}
            description="Blocked channels and the reasons for their removal"
            renderCard={(entry) => (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{entry.channel}</h3>
                    <p className="text-sm text-gray-400">Blocked Channel</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">Reason:</span>
                    <span className={`px-2 py-1 text-xs rounded-full uppercase ${
                      entry.reason === 'dmca' ? 'bg-red-600/30 text-red-300' : 'bg-yellow-600/30 text-yellow-300'
                    }`}>
                      {entry.reason}
                    </span>
                  </div>
                  
                  {/* {entry.ref && (
                    <a
                      href={entry.ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-xs break-all underline"
                    >
                      View Reference
                    </a>
                  )} */}
                </div>
              </div>
            )}
          />
        );
        
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onCountryChannels={handleCountryChannels}
      />
      
      <div className="lg:ml-80 transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;