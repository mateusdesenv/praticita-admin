import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type OrderStatus = 'draft' | 'awaiting_deposit' | 'confirmed' | 'in_production' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid';
export interface Customer { id: string; name: string; phone: string; email: string | null; address: string | null; notes: string | null; isActive: boolean; createdAt: string; updatedAt: string; }
export type CustomerInput = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export interface OrderItem { productId: string | null; name: string; quantity: number; unitPrice: number; notes: string | null; }
export interface Order {
  id: string; code: string; customerId: string | null; customerName: string; customerPhone: string; items: OrderItem[];
  deliveryDate: string; deliveryTime: string; fulfillment: 'pickup' | 'delivery'; deliveryAddress: string | null;
  status: OrderStatus; paymentStatus: PaymentStatus; depositAmount: number; deliveryFee: number; discount: number;
  subtotal: number; total: number; notes: string | null; productionNotes: string | null; createdAt: string; updatedAt: string;
}
export type OrderInput = Omit<Order, 'id' | 'code' | 'subtotal' | 'total' | 'createdAt' | 'updatedAt'>;
export interface OperationsSummary { today: number; pendingConfirmation: number; inProduction: number; ready: number; delayed: number; futureRevenue: number; }

@Injectable({ providedIn: 'root' })
export class OperationsService {
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');
  constructor(private readonly auth: AuthService) {}
  customers(search = ''): Promise<Customer[]> { return this.request(`/operations/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`); }
  createCustomer(input: CustomerInput): Promise<Customer> { return this.write('/operations/customers', { method: 'POST', body: JSON.stringify(input) }); }
  updateCustomer(id: string, input: CustomerInput): Promise<Customer> { return this.write(`/operations/customers/${id}`, { method: 'PUT', body: JSON.stringify(input) }); }
  deleteCustomer(id: string): Promise<void> { return this.write(`/operations/customers/${id}`, { method: 'DELETE' }); }
  orders(query = ''): Promise<Order[]> { return this.request(`/operations/orders${query ? `?${query}` : ''}`); }
  summary(): Promise<OperationsSummary> { return this.request('/operations/summary'); }
  createOrder(input: OrderInput): Promise<Order> { return this.write('/operations/orders', { method: 'POST', body: JSON.stringify(input) }); }
  updateOrder(id: string, input: OrderInput): Promise<Order> { return this.write(`/operations/orders/${id}`, { method: 'PUT', body: JSON.stringify(input) }); }
  updateStatus(id: string, status: OrderStatus): Promise<Order> { return this.write(`/operations/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
  deleteOrder(id: string): Promise<void> { return this.write(`/operations/orders/${id}`, { method: 'DELETE' }); }
  private write<T>(path: string, init: RequestInit): Promise<T> { if (!this.auth.canWrite('operations')) throw new Error('Você possui acesso somente para leitura da operação.'); return this.request(path, init); }
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.auth.getAccessToken();
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'x-praticita-screen': 'operations', ...(init.headers || {}) } });
    if (!response.ok) { const body = await response.json().catch(() => null); const details = Array.isArray(body?.details) ? ` ${body.details.join(' ')}` : ''; throw new Error(`${body?.message || `Erro HTTP ${response.status}`}${details}`); }
    if (response.status === 204) return undefined as T; return response.json() as Promise<T>;
  }
}
