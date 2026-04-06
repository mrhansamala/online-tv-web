export interface Channel {
  id: string;
  name: string;
  alt_names: string[];
  network: string | null;
  owners: string[];
  country: string;
  categories: string[];
  is_nsfw: boolean;
  launched: string | null;
  closed: string | null;
  replaced_by: string | null;
  website: string | null;
}

export interface Feed {
  channel: string;
  id: string;
  name: string;
  alt_names: string[];
  is_main: boolean;
  broadcast_area: string[];
  timezones: string[];
  languages: string[];
  format: string;
}

export interface Logo {
  channel: string;
  feed: string | null;
  tags: string[];
  width: number;
  height: number;
  format: string | null;
  url: string;
}

export interface Stream {
  channel: string | null;
  feed: string | null;
  title: string;
  url: string;
  referrer: string | null;
  user_agent: string | null;
  quality: string | null;
  label: string | null;
}

export interface Guide {
  channel: string | null;
  feed: string | null;
  site: string;
  site_id: string;
  site_name: string;
  lang: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Language {
  name: string;
  code: string;
}

export interface Country {
  name: string;
  code: string;
  languages: string[];
  flag: string;
}

export interface Subdivision {
  country: string;
  name: string;
  code: string;
  parent: string | null;
}

export interface City {
  country: string;
  subdivision: string | null;
  name: string;
  code: string;
  wikidata_id: string;
}

export interface Region {
  code: string;
  name: string;
  countries: string[];
}

export interface Timezone {
  id: string;
  utc_offset: string;
  countries: string[];
}

export interface BlocklistEntry {
  channel: string;
  reason: string;
  ref: string;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  path: string;
}