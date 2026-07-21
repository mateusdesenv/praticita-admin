import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type FinancialEntryType = 'payable' | 'receivable' | 'supplier_invoice';
export type FinancialEntryStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export interface FinancialEntry {
  id: string; type: FinancialEntryType; description: string; amount: number; dueDate: string;
  competenceDate: string; paymentDate: string | null; status: FinancialEntryStatus; category: string | null;
  supplier: string | null; customer: string | null; documentNumber: string | null; accessKey: string | null;
  notes: string | null; createdAt: string; updatedAt: string;
}
export type FinancialEntryInput = Omit<FinancialEntry, 'id' | 'createdAt' | 'updatedAt'>;
export interface FinancialSummary { payablePending: number; receivablePending: number; paidThisMonth: number; receivedThisMonth: number; overdueCount: number; }

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');
  constructor(private readonly auth: AuthService) {}
  list(type?: FinancialEntryType): Promise<FinancialEntry[]> { return this.request(`/finance/entries${type ? `?type=${type}` : ''}`); }
  summary(): Promise<FinancialSummary> { return this.request('/finance/summary'); }
  create(input: FinancialEntryInput): Promise<FinancialEntry> { return this.request('/finance/entries', { method: 'POST', body: JSON.stringify(input) }); }
  update(id: string, input: FinancialEntryInput): Promise<FinancialEntry> { return this.request(`/finance/entries/${id}`, { method: 'PUT', body: JSON.stringify(input) }); }
  remove(id: string): Promise<void> { return this.request(`/finance/entries/${id}`, { method: 'DELETE' }); }
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (init.method && init.method !== 'GET' && !this.auth.canWrite('finance')) throw new Error('Você possui acesso somente para leitura do financeiro.');
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.auth.getAccessToken()}`, 'x-praticita-screen': 'finance', ...(init.headers || {}) } });
    if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.message || `Erro HTTP ${response.status}`); }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}
