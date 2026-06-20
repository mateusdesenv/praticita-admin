import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MenuData } from '../models/menu-data.model';
import { MenuRepository } from './menu.repository';

@Injectable()
export class ApiMenuRepository implements MenuRepository {
  private readonly baseUrl = this.normalizeBaseUrl(environment.apiBaseUrl);
  private readonly adminToken = environment.apiAdminToken?.trim() ?? '';

  async getMenuData(): Promise<MenuData> {
    return this.request<MenuData>('/menu-data');
  }

  async saveMenuData(data: MenuData): Promise<void> {
    await this.request<{ ok: true }>('/menu-data', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async exportData(): Promise<MenuData> {
    return this.request<MenuData>('/menu-data/export');
  }

  async importData(data: MenuData): Promise<void> {
    await this.request<{ ok: true }>('/menu-data/import', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async resetToSeed(): Promise<MenuData> {
    return this.request<MenuData>('/menu-data/reset', { method: 'POST' });
  }

  async clear(): Promise<void> {
    await this.request<void>('/menu-data', { method: 'DELETE' });
  }

  private normalizeBaseUrl(value: string): string {
    return value.replace(/\/+$/, '');
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.adminToken ? { Authorization: `Bearer ${this.adminToken}` } : {}),
        ...(init.headers || {})
      }
    });

    if (!response.ok) {
      const message = await this.readErrorMessage(response);
      throw new Error(message);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  private async readErrorMessage(response: Response): Promise<string> {
    try {
      const body = await response.json();
      return body?.message || body?.error || `Erro HTTP ${response.status}`;
    } catch {
      return `Erro HTTP ${response.status}`;
    }
  }
}
