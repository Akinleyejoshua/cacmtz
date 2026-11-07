import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Outreach General Settings (Heading, Subtitle, Scripture Verse)
export interface IOutreachSettings extends Document {
  heading: string;
  subtitle: string;
  verseText: string;
  verseRef: string;
}

const OutreachSettingsSchema: Schema<IOutreachSettings> = new Schema(
  {
    heading: {
      type: String,
      default: "CAC MOUNT ZION GLOBAL KINGDOM OUTREACH",
      required: true,
    },
    subtitle: {
      type: String,
      default:
        "Partnering together to impact lives, spread the Gospel, and build God's Kingdom.",
    },
    verseText: {
      type: String,
      default:
        "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.",
    },
    verseRef: {
      type: String,
      default: "2 Corinthians 9:7",
    },
  },
  { timestamps: true }
);

export const OutreachSettings: Model<IOutreachSettings> =
  (mongoose.models.OutreachSettings as Model<IOutreachSettings>) ||
  mongoose.model<IOutreachSettings>("OutreachSettings", OutreachSettingsSchema);

// 2. Revelation (Videos) - Supports multiple stacked video URLs
export interface IOutreachVideo extends Document {
  title: string;
  description: string;
  youtubeUrl?: string;
  youtubeUrls: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const OutreachVideoSchema: Schema<IOutreachVideo> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtubeUrl: { type: String, default: "" },
    youtubeUrls: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const OutreachVideo: Model<IOutreachVideo> =
  (mongoose.models.OutreachVideo as Model<IOutreachVideo>) ||
  mongoose.model<IOutreachVideo>("OutreachVideo", OutreachVideoSchema);

// 3. Bank Account
export interface IBankAccount extends Document {
  bank: string;
  name: string;
  accountNumber: string;
  type?: string;
  logo?: string;
  accepts: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BankAccountSchema: Schema<IBankAccount> = new Schema(
  {
    bank: { type: String, required: true },
    name: { type: String, required: true },
    accountNumber: { type: String, required: true },
    type: { type: String, default: "Current" },
    logo: { type: String, default: "/src/img/donations/abank.png" },
    accepts: { type: [String], default: ["General offering"] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const BankAccount: Model<IBankAccount> =
  (mongoose.models.BankAccount as Model<IBankAccount>) ||
  mongoose.model<IBankAccount>("BankAccount", BankAccountSchema);

// 4. Donation Type
export interface IDonationType extends Document {
  title: string;
  description: string;
  icon?: string;
}

const DonationTypeSchema: Schema<IDonationType> = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "💝" },
});

export const DonationType: Model<IDonationType> =
  (mongoose.models.DonationType as Model<IDonationType>) ||
  mongoose.model<IDonationType>("DonationType", DonationTypeSchema);

// 5. Church Project (Supports multiple images and video URLs)
export interface IChurchProject extends Document {
  title: string;
  description: string;
  images: string[];
  videoUrls: string[];
  amount?: number | null;
  currency: string;
  status: "Active" | "Ongoing" | "Completed";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChurchProjectSchema: Schema<IChurchProject> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    videoUrls: { type: [String], default: [] },
    amount: { type: Number, default: null },
    currency: { type: String, default: "NGN" },
    status: {
      type: String,
      enum: ["Active", "Ongoing", "Completed"],
      default: "Active",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ChurchProject: Model<IChurchProject> =
  (mongoose.models.ChurchProject as Model<IChurchProject>) ||
  mongoose.model<IChurchProject>("ChurchProject", ChurchProjectSchema);
