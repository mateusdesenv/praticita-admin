import { Injectable } from '@angular/core';
import { MenuData } from '../models/menu-data.model';
import { buildInitialMenuData } from '../seeds/initial-menu.seed';
import { MenuRepository } from './menu.repository';

const STORAGE_KEY = 'praticita:menu-data';
const LEGACY_KEYS = [
  'praticita:schema-version',
  'praticita:business-settings',
  'praticita:categories',
  'praticita:products',
  'praticita:product-variations',
  'praticita:option-groups',
  'praticita:product-options'
];

@Injectable()
export class LocalStorageMenuRepository implements MenuRepository {
  async getMenuData(): Promise<MenuData> {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      const seed = buildInitialMenuData();
      await this.saveMenuData(seed);
      return seed;
    }

    try {
      const parsed = JSON.parse(raw) as MenuData;
      this.assertValidMenuData(parsed);
      return parsed;
    } catch (error) {
      console.error('Falha ao ler localStorage. Restaurando seed inicial.', error);
      const seed = buildInitialMenuData();
      await this.saveMenuData(seed);
      return seed;
    }
  }

  async saveMenuData(data: MenuData): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, exportedAt: undefined }));
    localStorage.setItem('praticita:schema-version', String(data.schemaVersion));
  }

  async exportData(): Promise<MenuData> {
    const data = await this.getMenuData();
    return { ...data, exportedAt: new Date().toISOString() };
  }

  async importData(data: MenuData): Promise<void> {
    this.assertValidMenuData(data);
    await this.saveMenuData({ ...data, exportedAt: undefined });
  }

  async resetToSeed(): Promise<MenuData> {
    const seed = buildInitialMenuData();
    await this.saveMenuData(seed);
    return seed;
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  }

  private assertValidMenuData(data: MenuData): void {
    if (!data || typeof data.schemaVersion !== 'number') throw new Error('schemaVersion inválido.');
    if (!data.businessSettings) throw new Error('businessSettings ausente.');
    if (!Array.isArray(data.categories)) throw new Error('categories inválido.');
    if (!Array.isArray(data.products)) throw new Error('products inválido.');
    if (!Array.isArray(data.variations)) throw new Error('variations inválido.');
    if (!Array.isArray(data.optionGroups)) throw new Error('optionGroups inválido.');
    if (!Array.isArray(data.productOptions)) throw new Error('productOptions inválido.');
  }
}
