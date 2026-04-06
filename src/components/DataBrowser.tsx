import { ReactNode } from 'react';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';
import { Search, Filter, Globe, MapPin, Clock, Tag, Shield, Radio, Image, BookOpen, Building2 } from 'lucide-react';

interface DataBrowserProps {
  title: string;
  endpoint: string;
  icon: ReactNode;
  renderCard: (item: any) => ReactNode;
  description?: string;
}

const iconMap: Record<string, any> = {
  feeds: Radio,
  logos: Image,
  streams: Search,
  guides: BookOpen,
  categories: Tag,
  languages: Globe,
  countries: MapPin,
  subdivisions: Building2,
  cities: Building2,
  regions: MapPin,
  timezones: Clock,
  blocklist: Shield
};

export default function DataBrowser({ title, endpoint, icon, renderCard, description }: DataBrowserProps) {
  const { data, loading, error } = useApi(endpoint);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white text-lg mt-4">Loading {title.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              {icon}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          
          {description && (
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              {description}
            </p>
          )}
          
          <p className="text-lg text-gray-400">
            {data.length.toLocaleString()} {title.toLowerCase()} available
          </p>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <div key={item.id || item.code || index} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
              {renderCard(item)}
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No data found</h3>
            <p className="text-gray-400">The {title.toLowerCase()} database appears to be empty</p>
          </div>
        )}
      </div>
    </div>
  );
}