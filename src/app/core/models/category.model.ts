import { ID } from './common.model';

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  parentId?: ID | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
