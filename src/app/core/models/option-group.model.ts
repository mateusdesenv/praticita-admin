import { ID } from './common.model';

export interface OptionGroup {
  id: ID;
  productId: ID;
  name: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
