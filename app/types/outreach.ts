export interface OutreachSettingsData {
  _id?: string;
  heading: string;
  subtitle: string;
  verseText: string;
  verseRef: string;
}

export interface OutreachVideoData {
  _id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  youtubeUrls?: string[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankAccountData {
  _id: string;
  bank: string;
  name: string;
  accountNumber: string;
  type?: string;
  logo?: string;
  accepts?: string[];
  order?: number;
}

export interface DonationTypeData {
  _id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ChurchProjectData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  videoUrls?: string[];
  amount?: number | null;
  currency?: string;
  status: "Active" | "Ongoing" | "Completed";
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OutreachPagePayload {
  settings: OutreachSettingsData;
  accounts: BankAccountData[];
  types: DonationTypeData[];
  videos: OutreachVideoData[];
  projects: ChurchProjectData[];
}
