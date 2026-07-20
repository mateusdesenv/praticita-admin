import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Collaborator {
  id: string;
  name: string;
  cpf: string | null;
  email: string | null;
  photoURL: string | null;
  provider: 'cpf' | 'google';
  role: CollaboratorRole;
  permissions: Permissions;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CollaboratorRole = 'admin' | 'cozinheiro' | 'financeiro';
export type PermissionScreen = 'dashboard' | 'categories' | 'products' | 'collaborators' | 'settings' | 'backup';
export type Permissions = Record<PermissionScreen, { read: boolean; write: boolean }>;

export interface CollaboratorInput {
  name: string;
  cpf?: string;
  password?: string;
  isActive?: boolean;
  role: CollaboratorRole;
  permissions: Permissions;
}

@Injectable({ providedIn: 'root' })
export class CollaboratorsService {
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

  constructor(private readonly auth: AuthService) {}

  list(): Promise<Collaborator[]> {
    return this.request('/collaborators');
  }

  create(input: CollaboratorInput): Promise<Collaborator> {
    this.assertCanWrite();
    return this.request('/collaborators', { method: 'POST', body: JSON.stringify(input) });
  }

  update(id: string, input: CollaboratorInput): Promise<Collaborator> {
    this.assertCanWrite();
    return this.request(`/collaborators/${id}`, { method: 'PUT', body: JSON.stringify(input) });
  }

  remove(id: string): Promise<void> {
    this.assertCanWrite();
    return this.request(`/collaborators/${id}`, { method: 'DELETE' });
  }

  private assertCanWrite(): void {
    if (!this.auth.canWrite('collaborators')) {
      throw new Error('Você possui acesso somente para leitura de colaboradores.');
    }
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.auth.getAccessToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'x-praticita-screen': 'collaborators',
        ...(init.headers || {})
      }
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const details = Array.isArray(body?.details) ? ` ${body.details.join(' ')}` : '';
      throw new Error(`${body?.message || `Erro HTTP ${response.status}`}${details}`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}
