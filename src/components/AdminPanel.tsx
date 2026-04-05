import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CreditCard as Edit, Trash2, Upload, Check, X, Search, Filter, BarChart3, Globe, Tv, Users, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Channel } from '../types';

export const AdminPanel = () => {
  const { channels, setChannels, user } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this panel.</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalChannels: channels.length,
    workingChannels: channels.filter(c => c.is_working).length,
    countries: new Set(channels.map(c => c.country)).size,
    categories: new Set(channels.map(c => c.category)).size,
  };

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddChannel = (channelData: Partial<Channel>) => {
    const newChannel: Channel = {
      id: `admin-${Date.now()}`,
      name: channelData.name || '',
      country: channelData.country || '',
      category: channelData.category || 'general',
      language: channelData.language || 'English',
      logo: channelData.logo || '',
      stream_url: channelData.stream_url || '',
      stream_type: channelData.stream_type || 'hls',
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setChannels([...channels, newChannel]);
    setShowAddChannel(false);
  };

  const handleEditChannel = (channelData: Partial<Channel>) => {
    if (!editingChannel) return;

    const updatedChannels = channels.map(channel =>
      channel.id === editingChannel.id
        ? { ...channel, ...channelData, updated_at: new Date().toISOString() }
        : channel
    );

    setChannels(updatedChannels);
    setEditingChannel(null);
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannels(channels.filter(channel => channel.id !== channelId));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'channels', label: 'Channels', icon: Tv },
    { id: 'countries', label: 'Countries', icon: Globe },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user.email}</span>
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 min-h-screen border-r border-slate-700">
          <nav className="p-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Channels</p>
                      <p className="text-3xl font-bold text-white">{stats.totalChannels}</p>
                    </div>
                    <Tv className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Working Channels</p>
                      <p className="text-3xl font-bold text-green-400">{stats.workingChannels}</p>
                    </div>
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Countries</p>
                      <p className="text-3xl font-bold text-blue-400">{stats.countries}</p>
                    </div>
                    <Globe className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Categories</p>
                      <p className="text-3xl font-bold text-purple-400">{stats.categories}</p>
                    </div>
                    <Filter className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {channels.slice(0, 5).map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                        <Tv className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{channel.name}</p>
                        <p className="text-gray-400 text-sm">{channel.country} • {channel.category}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${channel.is_working ? 'bg-green-400' : 'bg-red-400'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Channel Management</h2>
                <button
                  onClick={() => setShowAddChannel(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Channel</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search channels..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Categories</option>
                  <option value="news">News</option>
                  <option value="sports">Sports</option>
                  <option value="movies">Movies</option>
                  <option value="music">Music</option>
                  <option value="kids">Kids</option>
                  <option value="documentary">Documentary</option>
                </select>
              </div>

              {/* Channels Table */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Channel</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredChannels.map((channel) => (
                        <tr key={channel.id} className="hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-slate-600 rounded-lg overflow-hidden mr-3">
                                {channel.logo ? (
                                  <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Tv className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{channel.name}</div>
                                <div className="text-sm text-gray-400">{channel.language}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{channel.country}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-slate-600 text-gray-300 rounded-full">
                              {channel.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              channel.is_working 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {channel.is_working ? 'Working' : 'Offline'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingChannel(channel)}
                                className="text-cyan-400 hover:text-cyan-300"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteChannel(channel.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Channel Modal */}
      <AnimatePresence>
        {(showAddChannel || editingChannel) && (
          <ChannelModal
            channel={editingChannel}
            onSave={editingChannel ? handleEditChannel : handleAddChannel}
            onClose={() => {
              setShowAddChannel(false);
              setEditingChannel(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface ChannelModalProps {
  channel?: Channel | null;
  onSave: (data: Partial<Channel>) => void;
  onClose: () => void;
}

const ChannelModal = ({ channel, onSave, onClose }: ChannelModalProps) => {
  const [formData, setFormData] = useState({
    name: channel?.name || '',
    country: channel?.country || '',
    category: channel?.category || 'general',
    language: channel?.language || 'English',
    logo: channel?.logo || '',
    stream_url: channel?.stream_url || '',
    stream_type: channel?.stream_type || 'hls',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          {channel ? 'Edit Channel' : 'Add New Channel'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Channel Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="general">General</option>
              <option value="news">News</option>
              <option value="sports">Sports</option>
              <option value="movies">Movies</option>
              <option value="music">Music</option>
              <option value="kids">Kids</option>
              <option value="documentary">Documentary</option>
              <option value="radio">Radio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Stream URL</label>
            <input
              type="url"
              value={formData.stream_url}
              onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors"
            >
              {channel ? 'Update' : 'Add'} Channel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};