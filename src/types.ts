export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  pan?: string;
}

export enum CampaignStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CLOSED = 'closed'
}

export enum CampaignCategory {
  MEDICAL = 'Medical',
  EDUCATION = 'Education',
  DISASTER_RELIEF = 'Disaster Relief',
  ANIMAL_WELFARE = 'Animal Welfare',
  ENVIRONMENT = 'Environment',
  OTHER = 'Other'
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  organizer: string;
  goalAmount: number;
  raisedAmount: number;
  category: CampaignCategory;
  imageUrl: string;
  endDate: string;
  status: CampaignStatus;
  donorCount: number;
}

export interface Donation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  date: string;
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  certificateUrl?: string; // 80G Certificate URL
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
