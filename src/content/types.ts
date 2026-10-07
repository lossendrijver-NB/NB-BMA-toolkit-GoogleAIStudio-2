export type Ambition = {
  id: string;
  title: string;
  slug: string;
  korteIntro?: string;
  shortIntro?: string;
  shortDescription: string;
  description: string[];
  searchTerms: string[];
  extraZoekwoorden?: string[] | string;
  extraKeywords?: string[] | string;
  serviceIds: string[];
  contactPersonId?: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  korteIntro?: string;
  shortIntro?: string;
  shortDescription: string;
  description: string[];
  image: string;
  searchTerms: string[];
  extraZoekwoorden?: string[] | string;
  extraKeywords?: string[] | string;
  ambitionIds: string[];
  caseIds: string[];
  contactPersonId?: string;
};

export type CaseMediaItem = {
  type: "image" | "video";
  url: string;
  poster?: string;
  title?: string;
  provider?: "vimeo" | "bunny" | "direct";
};

export type Case = {
  id: string;
  clientName: string;
  title: string;
  werktitel?: string;
  subtitle?: string;
  slug: string;
  image: string;
  korteIntro?: string;
  shortIntro?: string;
  shortDescription: string;
  serviceIds: string[];
  videoUrl?: string;
  videolink?: string;
  videos?: string[];
  afbeeldingen?: string[];
  images?: string[];
  media?: CaseMediaItem[];
  extraZoekwoorden?: string[] | string;
  extraKeywords?: string[] | string;
};

export type ContactPerson = {
  id: string;
  name: string;
  role: string;
  photo?: string;
  email: string;
  phone?: string;
  note?: string;
  isPlaceholder?: boolean;
};
