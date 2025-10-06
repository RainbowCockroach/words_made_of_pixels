export interface Tale {
  title: { [language: string]: string };
  author: string;
  lastUpdated: string;
  language: string[];
}

export interface Collection {
  name: { [language: string]: string };
  lastUpdated: string;
  language: string[];
  tales: string[];
}

export interface TalesData {
  [key: string]: Tale;
}

export interface CollectionsData {
  [key: string]: Collection;
}
