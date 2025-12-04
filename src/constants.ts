import { CampaignCategory } from "./types";

export const APP_NAME = "Engala Trust";
export const CURRENCY_SYMBOL = "₹";

export const CATEGORIES = [
  { label: 'All', value: 'ALL' },
  { label: 'Medical', value: CampaignCategory.MEDICAL },
  { label: 'Education', value: CampaignCategory.EDUCATION },
  { label: 'Disaster Relief', value: CampaignCategory.DISASTER_RELIEF },
  { label: 'Animals', value: CampaignCategory.ANIMAL_WELFARE },
];

export const MOCK_IMAGES = {
  MEDICAL: "https://picsum.photos/800/600?random=1",
  EDUCATION: "https://picsum.photos/800/600?random=2",
  DISASTER: "https://picsum.photos/800/600?random=3",
  ANIMAL: "https://picsum.photos/800/600?random=4",
  AVATAR: "https://picsum.photos/200/200?random=5",
};
