import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MenuData } from '../models/menu-data.model';
import { MenuRepository } from './menu.repository';
import { AuthService } from '../services/auth.service';
import type { PermissionScreen } from '../services/collaborators.service';

@Injectable()
export class ApiMenuRepository implements MenuRepository {
  private readonly baseUrl = this.normalizeBaseUrl(environment.apiBaseUrl);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

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
    if (init.method && init.method !== 'GET') {
      const screen = this.currentScreen();
      if (screen && !this.auth.canWrite(screen)) {
        throw new Error('Você possui acesso somente para leitura nesta tela.');
      }
    }
    const collaboratorSession = localStorage.getItem('praticita_collaborator_session');
    let token = environment.apiAdminToken?.trim() ?? '';
    try { token = JSON.parse(collaboratorSession || '{}')?.token || token; } catch {}
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(this.currentScreen() ? { 'x-praticita-screen': this.currentScreen()! } : {}),
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

  private currentScreen(): PermissionScreen | null {
    const url = this.router.url;
    if (url.includes('/categorias')) return 'categories';
    if (url.includes('/produtos')) return 'products';
    if (url.includes('/configuracoes')) return 'settings';
    if (url.includes('/importar-exportar')) return 'backup';
    return null;
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
