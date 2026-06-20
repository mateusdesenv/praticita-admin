import { ID } from './common.model';

export interface BusinessSettings {
  id: ID;
  businessName: string;
  businessSubtitle?: string;
  slogan?: string;
  whatsapp: string;
  address?: string;
  neighborhood?: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  deliveryNote?: string;
  quoteNote?: string;
  logoUrl?: string | null;
  instagramUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
