import { InjectionToken } from '@angular/core';
import { ID } from '../models/common.model';
import { MenuData } from '../models/menu-data.model';

export interface MenuRepository {
  getMenuData(): Promise<MenuData>;
  saveMenuData(data: MenuData): Promise<void>;
  exportData(): Promise<MenuData>;
  importData(data: MenuData): Promise<void>;
  resetToSeed(): Promise<MenuData>;
  clear(): Promise<void>;
}

export const MENU_REPOSITORY = new InjectionToken<MenuRepository>('MENU_REPOSITORY');

export function updateCollectionItem<T extends { id: ID }>(items: T[], id: ID, patch: Partial<T>): T[] {
  return items.map((item) => item.id === id ? { ...item, ...patch } : item);
}
