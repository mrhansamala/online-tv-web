/*
  # IPTV Database Schema

  1. New Tables
    - `countries`
      - `code` (text, primary key) - ISO country code
      - `name` (text, not null) - Country name
      - `flag` (text) - Flag emoji or URL
      - `channel_count` (integer, default 0) - Number of channels
      - `coordinates` (jsonb) - Lat/lng coordinates for globe
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `channels`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Channel name
      - `country_code` (text, foreign key) - Reference to countries
      - `category` (text, not null) - Channel category
      - `language` (text) - Primary language
      - `logo` (text) - Logo URL
      - `stream_url` (text, not null) - Stream URL
      - `stream_type` (text, not null) - Type: hls, mp4, youtube, twitch
      - `is_working` (boolean, default true) - Stream status
      - `metadata` (jsonb) - Additional channel data
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - Reference to auth.users
      - `channel_id` (uuid, foreign key) - Reference to channels
      - `created_at` (timestamp)

    - `api_sources`
      - `id` (uuid, primary key)
      - `name` (text, not null) - API source name
      - `url` (text, not null) - API endpoint URL
      - `api_key` (text) - API key if required
      - `is_active` (boolean, default true)
      - `last_sync` (timestamp)
      - `config` (jsonb) - API configuration
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only policies for management tables
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  code text PRIMARY KEY,
  name text NOT NULL,
  flag text DEFAULT '',
  channel_count integer DEFAULT 0,
  coordinates jsonb DEFAULT '{"lat": 0, "lng": 0}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_code text REFERENCES countries(code) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'general',
  language text DEFAULT 'Unknown',
  logo text DEFAULT '',
  stream_url text NOT NULL,
  stream_type text NOT NULL DEFAULT 'hls',
  is_working boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id uuid REFERENCES channels(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, channel_id)
);

-- Create API sources table
CREATE TABLE IF NOT EXISTS api_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  api_key text DEFAULT '',
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_sources ENABLE ROW LEVEL SECURITY;

-- Countries policies (public read, admin write)
CREATE POLICY "Countries are viewable by everyone"
  ON countries FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Countries are insertable by admins"
  ON countries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Countries are updatable by admins"
  ON countries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Channels policies (public read, admin write)
CREATE POLICY "Channels are viewable by everyone"
  ON channels FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Channels are insertable by admins"
  ON channels FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Channels are updatable by admins"
  ON channels FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- User favorites policies (users can manage their own)
CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- API sources policies (admin only)
CREATE POLICY "API sources are viewable by admins"
  ON api_sources FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "API sources are manageable by admins"
  ON api_sources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_channels_country ON channels(country_code);
CREATE INDEX IF NOT EXISTS idx_channels_category ON channels(category);
CREATE INDEX IF NOT EXISTS idx_channels_language ON channels(language);
CREATE INDEX IF NOT EXISTS idx_channels_working ON channels(is_working);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_channel ON user_favorites(channel_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON countries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_sources_updated_at
  BEFORE UPDATE ON api_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
