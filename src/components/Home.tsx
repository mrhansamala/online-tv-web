import { useState, useEffect } from 'react';
import { Tv, Globe, Play, Zap, Users, Clock, Star } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    channels: 0,
    countries: 0,
    streams: 0,
    categories: 0
  });

  const features = [
    {
      icon: Tv,
      title: "Live TV Channels",
      description: "Access thousands of live TV channels from around the world",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Channels from every continent and major broadcasting networks",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Play,
      title: "Multiple Streams",
      description: "Multiple stream qualities and formats for optimal viewing",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Always up-to-date channel listings and stream information",
      color: "from-orange-500 to-orange-600"
    }
  ];

  useEffect(() => {
    // Simulate loading stats with animation
    const animateStats = () => {
      const targetStats = { channels: 8000, countries: 195, streams: 15000, categories: 50 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        const progress = currentStep / steps;
        setStats({
          channels: Math.floor(targetStats.channels * progress),
          countries: Math.floor(targetStats.countries * progress),
          streams: Math.floor(targetStats.streams * progress),
          categories: Math.floor(targetStats.categories * progress)
        });
        
        currentStep++;
        if (currentStep > steps) {
          clearInterval(interval);
          setStats(targetStats);
        }
      }, stepDuration);
    };

    animateStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center animate-pulse">
                  <Tv className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fadeIn">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                VERTEX.TV Hub
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover and stream live television channels from around the globe. 
              Your gateway to worldwide entertainment, news, and culture.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Watching
                </div>
              </button>
              
              <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Explore Channels
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {stats.channels.toLocaleString()}+
                </div>
                <div className="text-gray-300">Live Channels</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stats.countries}+
                </div>
                <div className="text-gray-300">Countries</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {stats.streams.toLocaleString()}+
                </div>
                <div className="text-gray-300">Live Streams</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {stats.categories}+
                </div>
                <div className="text-gray-300">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">VERTEX.TV Hub?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of television with our cutting-edge streaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="flex justify-center mb-6">
              <Star className="w-12 h-12 text-yellow-400 animate-pulse" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Streaming?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Join millions of viewers worldwide and access premium content from every corner of the globe
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Browse Channels
                </div>
              </button>
              
              <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  View Schedule
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
