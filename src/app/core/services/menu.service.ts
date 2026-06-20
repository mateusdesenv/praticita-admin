import { computed, inject, Injectable, signal } from '@angular/core';
import { BusinessSettings } from '../models/business-settings.model';
import { Category } from '../models/category.model';
import { AvailabilityStatus, ID, PriceType } from '../models/common.model';
import { MenuData, PublicMenuSection } from '../models/menu-data.model';
import { OptionGroup } from '../models/option-group.model';
import { ProductOption } from '../models/product-option.model';
import { ProductVariation } from '../models/product-variation.model';
import { Product } from '../models/product.model';
import { buildInitialMenuData } from '../seeds/initial-menu.seed';
import { createId } from '../utils/id.util';
import { slugify, uniqueSlug } from '../utils/slug.util';
import { formatCurrencyBR } from '../utils/currency.util';
import { MENU_REPOSITORY, MenuRepository } from '../repositories/menu.repository';

export type ProductInput = Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & { slug?: string };
export type CategoryInput = Omit<Category, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & { slug?: string };

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly repository = inject<MenuRepository>(MENU_REPOSITORY);
  private readonly state = signal<MenuData | null>(null);

  readonly data = computed(() => this.state());
  readonly categories = computed(() => this.sortByOrder(this.state()?.categories ?? []));
  readonly products = computed(() => this.sortByOrder(this.state()?.products ?? []));
  readonly variations = computed(() => this.sortByOrder(this.state()?.variations ?? []));
  readonly optionGroups = computed(() => this.sortByOrder(this.state()?.optionGroups ?? []));
  readonly productOptions = computed(() => this.sortByOrder(this.state()?.productOptions ?? []));
  readonly businessSettings = computed(() => this.state()?.businessSettings ?? buildInitialMenuData().businessSettings);

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const data = await this.repository.getMenuData();
    this.state.set(data);
  }

  async saveAll(data: MenuData): Promise<void> {
    this.state.set(data);
    await this.repository.saveMenuData(data);
  }

  getSnapshot(): MenuData {
    return this.state() ?? buildInitialMenuData();
  }

  getCategoryById(id: ID): Category | undefined {
    return this.getSnapshot().categories.find((category) => category.id === id);
  }

  getProductById(id: ID): Product | undefined {
    return this.getSnapshot().products.find((product) => product.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.getSnapshot().products.find((product) => product.slug === slug);
  }

  getVariationsByProduct(productId: ID): ProductVariation[] {
    return this.sortByOrder(this.getSnapshot().variations.filter((variation) => variation.productId === productId));
  }

  getOptionGroupsByProduct(productId: ID): Array<OptionGroup & { options: ProductOption[] }> {
    const data = this.getSnapshot();
    return this.sortByOrder(data.optionGroups.filter((group) => group.productId === productId))
      .map((group) => ({
        ...group,
        options: this.sortByOrder(data.productOptions.filter((option) => option.optionGroupId === group.id))
      }));
  }

  getPublicSections(searchTerm = ''): PublicMenuSection[] {
    const data = this.getSnapshot();
    const term = searchTerm.trim().toLowerCase();

    return this.sortByOrder(data.categories)
      .filter((category) => category.isActive)
      .map((category) => {
        const products = this.sortByOrder(data.products)
          .filter((product) => product.categoryId === category.id && product.isActive && product.availabilityStatus !== 'unavailable')
          .filter((product) => {
            if (!term) return true;
            const searchable = [product.name, product.shortDescription, product.fullDescription, product.pricingNote, product.availabilityNote].filter(Boolean).join(' ').toLowerCase();
            return searchable.includes(term);
          })
          .map((product) => ({
            ...product,
            variations: this.sortByOrder(data.variations.filter((variation) => variation.productId === product.id && variation.isActive)),
            optionGroups: this.getOptionGroupsByProduct(product.id).map((group) => ({
              ...group,
              options: group.options.filter((option) => option.isActive)
            }))
          }));

        return { ...category, products };
      })
      .filter((section) => section.products.length > 0);
  }

  getPriceLabel(product: Product): string {
    if (product.priceType === 'quote' || product.availabilityStatus === 'quote') return 'Solicitar orçamento';
    if (product.availabilityStatus === 'on_request') {
      const price = this.buildBasePriceLabel(product);
      return `${price} · verificar disponibilidade`;
    }
    if (product.priceType === 'variation') {
      const activeVariations = this.getVariationsByProduct(product.id).filter((variation) => variation.isActive);
      if (!activeVariations.length) return 'Preço sob consulta';
      const minPrice = Math.min(...activeVariations.map((variation) => variation.price));
      return `A partir de ${formatCurrencyBR(minPrice)}`;
    }

    return this.buildBasePriceLabel(product);
  }

  buildBasePriceLabel(product: Product): string {
    const value = formatCurrencyBR(product.basePrice);
    if (product.priceType === 'kg') return `${value}/kg`;
    if (product.priceType === 'unit') return `${value}/${product.unitLabel ?? 'unidade'}`;
    if (product.priceType === 'hundred') return `${value} o cento`;
    if (product.priceType === 'package') return `${value}/${product.unitLabel ?? 'pacote'}`;
    if (product.unitLabel) return `${value} · ${product.unitLabel}`;
    return value;
  }

  async createCategory(input: CategoryInput): Promise<Category> {
    const data = this.getSnapshot();
    const item: Category = {
      id: createId('cat'),
      name: input.name.trim(),
      slug: uniqueSlug(input.slug || input.name, data.categories.map((category) => category.slug)),
      description: input.description ?? '',
      parentId: input.parentId ?? null,
      imageUrl: input.imageUrl ?? null,
      displayOrder: Number(input.displayOrder ?? data.categories.length + 1),
      isActive: Boolean(input.isActive),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.saveAll({ ...data, categories: [...data.categories, item] });
    return item;
  }

  async updateCategory(id: ID, patch: Partial<Category>): Promise<void> {
    const data = this.getSnapshot();
    const updated = data.categories.map((category) => category.id === id
      ? { ...category, ...patch, slug: patch.slug ? slugify(patch.slug) : category.slug, updatedAt: new Date().toISOString() }
      : category
    );
    await this.saveAll({ ...data, categories: updated });
  }

  async deleteCategory(id: ID): Promise<void> {
    const data = this.getSnapshot();
    const hasProducts = data.products.some((product) => product.categoryId === id);
    if (hasProducts) throw new Error('Não é possível excluir categoria com produtos vinculados.');

    await this.saveAll({ ...data, categories: data.categories.filter((category) => category.id !== id) });
  }

  async createProduct(input: ProductInput): Promise<Product> {
    const data = this.getSnapshot();
    const item: Product = {
      ...input,
      id: createId('prod'),
      name: input.name.trim(),
      slug: uniqueSlug(input.slug || input.name, data.products.map((product) => product.slug)),
      basePrice: this.normalizeNumber(input.basePrice),
      minQuantity: this.normalizeNumber(input.minQuantity),
      preparationDays: this.normalizeNumber(input.preparationDays),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await this.saveAll({ ...data, products: [...data.products, item] });
    return item;
  }

  async updateProduct(id: ID, patch: Partial<Product>): Promise<void> {
    const data = this.getSnapshot();
    const updated = data.products.map((product) => product.id === id
      ? {
          ...product,
          ...patch,
          slug: patch.slug ? slugify(patch.slug) : product.slug,
          basePrice: 'basePrice' in patch ? this.normalizeNumber(patch.basePrice) : product.basePrice,
          minQuantity: 'minQuantity' in patch ? this.normalizeNumber(patch.minQuantity) : product.minQuantity,
          preparationDays: 'preparationDays' in patch ? this.normalizeNumber(patch.preparationDays) : product.preparationDays,
          updatedAt: new Date().toISOString()
        }
      : product
    );
    await this.saveAll({ ...data, products: updated });
  }

  async deleteProduct(id: ID): Promise<void> {
    const data = this.getSnapshot();
    const groupIds = data.optionGroups.filter((group) => group.productId === id).map((group) => group.id);

    await this.saveAll({
      ...data,
      products: data.products.filter((product) => product.id !== id),
      variations: data.variations.filter((variation) => variation.productId !== id),
      optionGroups: data.optionGroups.filter((group) => group.productId !== id),
      productOptions: data.productOptions.filter((option) => !groupIds.includes(option.optionGroupId))
    });
  }

  async duplicateProduct(id: ID): Promise<Product> {
    const product = this.getProductById(id);
    if (!product) throw new Error('Produto não encontrado.');
    const duplicated = await this.createProduct({
      ...product,
      name: `${product.name} (cópia)`,
      slug: undefined,
      displayOrder: product.displayOrder + 1
    });

    for (const variation of this.getVariationsByProduct(id)) {
      await this.createVariation({ ...variation, productId: duplicated.id });
    }

    return duplicated;
  }

  async createVariation(input: Omit<ProductVariation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductVariation> {
    const data = this.getSnapshot();
    const variation: ProductVariation = {
      ...input,
      id: createId('var'),
      price: Number(input.price ?? 0),
      minQuantity: this.normalizeNumber(input.minQuantity),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await this.saveAll({ ...data, variations: [...data.variations, variation] });
    return variation;
  }

  async updateVariation(id: ID, patch: Partial<ProductVariation>): Promise<void> {
    const data = this.getSnapshot();
    const updated = data.variations.map((variation) => variation.id === id
      ? { ...variation, ...patch, price: Number(patch.price ?? variation.price), updatedAt: new Date().toISOString() }
      : variation
    );
    await this.saveAll({ ...data, variations: updated });
  }

  async deleteVariation(id: ID): Promise<void> {
    const data = this.getSnapshot();
    await this.saveAll({ ...data, variations: data.variations.filter((variation) => variation.id !== id) });
  }

  async createOptionGroup(input: Omit<OptionGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<OptionGroup> {
    const data = this.getSnapshot();
    const group: OptionGroup = {
      ...input,
      id: createId('group'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await this.saveAll({ ...data, optionGroups: [...data.optionGroups, group] });
    return group;
  }

  async updateOptionGroup(id: ID, patch: Partial<OptionGroup>): Promise<void> {
    const data = this.getSnapshot();
    const updated = data.optionGroups.map((group) => group.id === id ? { ...group, ...patch, updatedAt: new Date().toISOString() } : group);
    await this.saveAll({ ...data, optionGroups: updated });
  }

  async deleteOptionGroup(id: ID): Promise<void> {
    const data = this.getSnapshot();
    await this.saveAll({
      ...data,
      optionGroups: data.optionGroups.filter((group) => group.id !== id),
      productOptions: data.productOptions.filter((option) => option.optionGroupId !== id)
    });
  }

  async createProductOption(input: Omit<ProductOption, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductOption> {
    const data = this.getSnapshot();
    const option: ProductOption = {
      ...input,
      id: createId('opt'),
      additionalPrice: Number(input.additionalPrice ?? 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await this.saveAll({ ...data, productOptions: [...data.productOptions, option] });
    return option;
  }

  async updateProductOption(id: ID, patch: Partial<ProductOption>): Promise<void> {
    const data = this.getSnapshot();
    const updated = data.productOptions.map((option) => option.id === id ? { ...option, ...patch, additionalPrice: Number(patch.additionalPrice ?? option.additionalPrice), updatedAt: new Date().toISOString() } : option);
    await this.saveAll({ ...data, productOptions: updated });
  }

  async deleteProductOption(id: ID): Promise<void> {
    const data = this.getSnapshot();
    await this.saveAll({ ...data, productOptions: data.productOptions.filter((option) => option.id !== id) });
  }

  async updateBusinessSettings(patch: Partial<BusinessSettings>): Promise<void> {
    const data = this.getSnapshot();
    await this.saveAll({
      ...data,
      businessSettings: { ...data.businessSettings, ...patch, updatedAt: new Date().toISOString() }
    });
  }

  async exportData(): Promise<MenuData> {
    return this.repository.exportData();
  }

  async importData(data: MenuData): Promise<void> {
    await this.repository.importData(data);
    this.state.set({ ...data, exportedAt: undefined });
  }

  async resetToSeed(): Promise<void> {
    const seed = await this.repository.resetToSeed();
    this.state.set(seed);
  }

  private sortByOrder<T extends { displayOrder: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  private normalizeNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
