import { BusinessSettings } from './business-settings.model';
import { Category } from './category.model';
import { OptionGroup } from './option-group.model';
import { ProductOption } from './product-option.model';
import { ProductVariation } from './product-variation.model';
import { Product } from './product.model';

export interface MenuData {
  schemaVersion: number;
  businessSettings: BusinessSettings;
  categories: Category[];
  products: Product[];
  variations: ProductVariation[];
  optionGroups: OptionGroup[];
  productOptions: ProductOption[];
  exportedAt?: string;
}

export interface PublicMenuSection extends Category {
  products: Array<Product & {
    variations: ProductVariation[];
    optionGroups: Array<OptionGroup & { options: ProductOption[] }>;
  }>;
}
