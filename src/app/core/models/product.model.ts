import { AvailabilityStatus, ID, PriceType } from './common.model';

export interface Product {
  id: ID;
  categoryId: ID;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  imageUrl?: string | null;
  priceType: PriceType;
  basePrice?: number | null;
  unitLabel?: string | null;
  minQuantity?: number | null;
  preparationDays?: number | null;
  availabilityStatus: AvailabilityStatus;
  availabilityNote?: string | null;
  pricingNote?: string | null;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
