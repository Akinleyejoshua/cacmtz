import {
  OutreachSettings,
  OutreachVideo,
  BankAccount,
  DonationType,
  ChurchProject,
  IOutreachSettings,
} from "../models/outreach";
import Analytics from "../models/analytics";
import dbConnect from "../db";

// Default initial accounts for seed
const INITIAL_BANKS = [
  {
    bank: "Access Bank",
    name: "C.A.C Mount Zion Ojodu",
    accountNumber: "0017420693",
    type: "Current",
    logo: "/src/img/donations/abank.png",
    accepts: ["Tithe"],
    order: 1,
  },
  {
    bank: "Access Bank",
    name: "Akinleye Joseph Ayodare",
    accountNumber: "0016422566",
    type: "Current",
    logo: "/src/img/donations/abank.png",
    accepts: ["Devine Partnership"],
    order: 2,
  },
  {
    bank: "First Bank PLC",
    name: "C.A.C Mount Zion Ojodu",
    accountNumber: "2026245339",
    type: "Current",
    logo: "/src/img/donations/fbank.jpg",
    accepts: ["Devine Partnership"],
    order: 3,
  },
  {
    bank: "First Bank PLC",
    name: "Akinleye Joseph Ayodare",
    accountNumber: "3133764368",
    type: "Savings",
    logo: "/src/img/donations/fbank.jpg",
    accepts: ["Devine Partnership"],
    order: 4,
  },
  {
    bank: "Access Bank",
    name: "C.A.C Mount Zion Ojodu",
    accountNumber: "0017420686",
    type: "Current",
    logo: "/src/img/donations/abank.png",
    accepts: ["General offering"],
    order: 5,
  },
  {
    bank: "Guaranty Trust Bank",
    name: "C.A.C Mount Zion Ojodu",
    accountNumber: "0019526325",
    type: "Current",
    logo: "/src/img/donations/gtbank.jpg",
    accepts: ["Missionary account"],
    order: 6,
  },
  {
    bank: "UBA",
    name: "C.A.C Kingdom Zone",
    accountNumber: "3004620197",
    type: "Dollar Account",
    logo: "/src/img/donations/uba.png",
    accepts: ["General"],
    order: 7,
  },
  {
    bank: "Zenith",
    name: "C.A.C Mount Zion Pentecostal Congress",
    accountNumber: "13311814993",
    type: "Current",
    logo: "/src/img/donations/zbank.png",
    accepts: ["Convention"],
    order: 8,
  },
];

const INITIAL_TYPES = [
  {
    title: "Tithe",
    description: "Giving back the Lord's tithe as an act of worship.",
    icon: "💒",
  },
  {
    title: "Offering",
    description: "Freewill offerings for church operations and ministries.",
    icon: "💝",
  },
  {
    title: "Missions & Outreach",
    description: "Support local and international soul-winning mission work.",
    icon: "🌍",
  },
  {
    title: "Building Fund",
    description: "Contributions toward church infrastructure, maintenance, and facilities.",
    icon: "🏗️",
  },
  {
    title: "Divine Partnership",
    description: "Special covenant partnership for kingdom advancement.",
    icon: "🤝",
  },
  {
    title: "Other / Projects",
    description: "Designate your gift toward a specific church project or need.",
    icon: "🔖",
  },
];

export async function getOutreachPageData() {
  await dbConnect();

  // 1. Settings
  let settings = await OutreachSettings.findOne().lean();
  if (!settings) {
    const created = await OutreachSettings.create({
      heading: "CAC MOUNT ZION GLOBAL KINGDOM OUTREACH",
      subtitle:
        "Partnering together to impact lives, spread the Gospel, and build God's Kingdom.",
      verseText:
        "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.",
      verseRef: "2 Corinthians 9:7",
    });
    settings = created.toObject();
  }

  // 2. Bank Accounts (Seed if empty)
  let accounts = await BankAccount.find().sort({ order: 1, createdAt: -1 }).lean();
  if (!accounts || accounts.length === 0) {
    await BankAccount.insertMany(INITIAL_BANKS);
    accounts = await BankAccount.find().sort({ order: 1, createdAt: -1 }).lean();
  }

  // 3. Donation Types (Seed if empty)
  let types = await DonationType.find().lean();
  if (!types || types.length === 0) {
    await DonationType.insertMany(INITIAL_TYPES);
    types = await DonationType.find().lean();
  }

  // 4. Videos (Revelation)
  const rawVideos = await OutreachVideo.find().sort({ order: 1, createdAt: -1 }).lean();
  const videos = rawVideos.map((v: any) => ({
    ...v,
    youtubeUrls: v.youtubeUrls && v.youtubeUrls.length > 0 ? v.youtubeUrls : v.youtubeUrl ? [v.youtubeUrl] : [],
  }));

  // 5. Projects
  const rawProjects = await ChurchProject.find().sort({ order: 1, createdAt: -1 }).lean();
  const projects = rawProjects.map((p: any) => ({
    ...p,
    images: p.images || [],
    videoUrls: p.videoUrls || [],
  }));

  // 6. Metrics & Stats
  let donatePageViews = 0;
  try {
    donatePageViews = await Analytics.countDocuments({
      pageUrl: { $regex: /^\/donate/i },
    });
  } catch (err) {
    // Non-fatal if analytics query fails
  }

  const totalStackedVideos = videos.reduce((acc: number, v: any) => {
    const count = v.youtubeUrls?.length || (v.youtubeUrl ? 1 : 0);
    return acc + count;
  }, 0);

  const totalTargetAmount = projects.reduce((acc: number, p: any) => {
    return acc + (Number(p.amount) || 0);
  }, 0);

  const totalProjectAssets = projects.reduce((acc: number, p: any) => {
    return acc + (p.images?.length || 0) + (p.videoUrls?.length || 0);
  }, 0);

  const activeProjectsCount = projects.filter(
    (p: any) => p.status === "Active" || !p.status
  ).length;

  const completedProjectsCount = projects.filter(
    (p: any) => p.status === "Completed"
  ).length;

  const stats = {
    totalRevelations: videos.length,
    totalVideosStacked: totalStackedVideos,
    totalAccounts: accounts.length,
    totalCategories: types.length,
    totalProjects: projects.length,
    activeProjects: activeProjectsCount,
    completedProjects: completedProjectsCount,
    totalTargetAmount,
    totalProjectAssets,
    donatePageViews,
  };

  return {
    settings,
    accounts,
    types,
    videos,
    projects,
    stats,
  };
}

// Settings
export async function getSettings() {
  await dbConnect();
  let settings = await OutreachSettings.findOne().lean();
  if (!settings) {
    const created = await OutreachSettings.create({});
    settings = created.toObject();
  }
  return settings;
}

export async function updateSettings(data: Partial<IOutreachSettings>) {
  await dbConnect();
  let settings = await OutreachSettings.findOne();
  if (!settings) {
    settings = await OutreachSettings.create(data);
  } else {
    settings = await OutreachSettings.findOneAndUpdate({}, data, {
      new: true,
    });
  }
  return settings;
}

// Videos (Revelation)
export async function getVideos() {
  await dbConnect();
  const rawVideos = await OutreachVideo.find().sort({ order: 1, createdAt: -1 }).lean();
  return rawVideos.map((v: any) => ({
    ...v,
    youtubeUrls: v.youtubeUrls && v.youtubeUrls.length > 0 ? v.youtubeUrls : v.youtubeUrl ? [v.youtubeUrl] : [],
  }));
}

export async function createVideo(data: {
  title: string;
  description: string;
  youtubeUrl?: string;
  youtubeUrls?: string[];
  order?: number;
}) {
  await dbConnect();
  const urls =
    data.youtubeUrls && data.youtubeUrls.length > 0
      ? data.youtubeUrls.map((u) => u.trim()).filter(Boolean)
      : data.youtubeUrl
      ? [data.youtubeUrl.trim()]
      : [];

  return await OutreachVideo.create({
    ...data,
    youtubeUrls: urls,
    youtubeUrl: urls[0] || "",
  });
}

export async function updateVideo(id: string, data: any) {
  await dbConnect();
  const urls =
    data.youtubeUrls && data.youtubeUrls.length > 0
      ? data.youtubeUrls.map((u: string) => u.trim()).filter(Boolean)
      : data.youtubeUrl
      ? [data.youtubeUrl.trim()]
      : [];

  return await OutreachVideo.findByIdAndUpdate(
    id,
    {
      ...data,
      youtubeUrls: urls,
      youtubeUrl: urls[0] || "",
    },
    { new: true }
  );
}

export async function deleteVideo(id: string) {
  await dbConnect();
  return await OutreachVideo.findByIdAndDelete(id);
}

// Accounts
export async function getAccounts() {
  await dbConnect();
  let accounts = await BankAccount.find().sort({ order: 1, createdAt: -1 }).lean();
  if (!accounts || accounts.length === 0) {
    await BankAccount.insertMany(INITIAL_BANKS);
    accounts = await BankAccount.find().sort({ order: 1, createdAt: -1 }).lean();
  }
  return accounts;
}

export async function createAccount(data: any) {
  await dbConnect();
  return await BankAccount.create(data);
}

export async function updateAccount(id: string, data: any) {
  await dbConnect();
  return await BankAccount.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteAccount(id: string) {
  await dbConnect();
  return await BankAccount.findByIdAndDelete(id);
}

// Types
export async function getDonationTypes() {
  await dbConnect();
  let types = await DonationType.find().lean();
  if (!types || types.length === 0) {
    await DonationType.insertMany(INITIAL_TYPES);
    types = await DonationType.find().lean();
  }
  return types;
}

export async function createDonationType(data: any) {
  await dbConnect();
  return await DonationType.create(data);
}

export async function deleteDonationType(id: string) {
  await dbConnect();
  return await DonationType.findByIdAndDelete(id);
}

// Projects
export async function getProjects() {
  await dbConnect();
  const rawProjects = await ChurchProject.find().sort({ order: 1, createdAt: -1 }).lean();
  return rawProjects.map((p: any) => ({
    ...p,
    images: p.images || [],
    videoUrls: p.videoUrls || [],
  }));
}

export async function createProject(data: {
  title: string;
  description: string;
  images?: string[];
  videoUrls?: string[];
  amount?: number | null;
  currency?: string;
  status?: "Active" | "Ongoing" | "Completed";
  order?: number;
}) {
  await dbConnect();
  return await ChurchProject.create({
    ...data,
    images: Array.isArray(data.images) ? data.images : [],
    videoUrls: Array.isArray(data.videoUrls) ? data.videoUrls.filter(Boolean) : [],
  });
}

export async function updateProject(id: string, data: any) {
  await dbConnect();
  return await ChurchProject.findByIdAndUpdate(
    id,
    {
      ...data,
      images: Array.isArray(data.images) ? data.images : [],
      videoUrls: Array.isArray(data.videoUrls) ? data.videoUrls.filter(Boolean) : [],
    },
    { new: true }
  );
}

export async function deleteProject(id: string) {
  await dbConnect();
  return await ChurchProject.findByIdAndDelete(id);
}
