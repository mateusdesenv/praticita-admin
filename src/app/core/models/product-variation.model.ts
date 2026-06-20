import { ID } from './common.model';

export interface ProductVariation {
  id: ID;
  productId: ID;
  name: string;
  sizeLabel?: string | null;
  weightLabel?: string | null;
  servesLabel?: string | null;
  price: number;
  unitLabel?: string | null;
  minQuantity?: number | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
