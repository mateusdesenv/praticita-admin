import { ID } from './common.model';

export interface ProductOption {
  id: ID;
  optionGroupId: ID;
  name: string;
  additionalPrice: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
