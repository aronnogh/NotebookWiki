export interface WikiConfig {
  title: string;
  subtitle: string;
  author: string;
  lastUpdated: string;
  categories: string[];
}

export interface Wiki {
  config: WikiConfig;
  notebook: any;
}
