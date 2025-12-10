export interface Stats {
  users: { total: number };
  campaigns: { total: number; pending: number; approved: number; rejected?: number };
  donations: { total: number; totalAmount: number };
  recentDonations: any[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type AdminTab = 'pending' | 'rejected' | 'my-campaigns' | 'my-donations' | 'all-donations' | 'newsletter';

