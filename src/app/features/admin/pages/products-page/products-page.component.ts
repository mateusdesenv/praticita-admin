import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-header">
      <div>
        <h1>Produtos</h1>
        <p>CRUD completo dos produtos do cardápio.</p>
      </div>
      <a class="button" routerLink="/admin/produtos/novo">Novo produto</a>
    </div>

    <section class="search-card">
      <div class="form-grid three">
        <input class="form-control" [(ngModel)]="search" placeholder="Buscar produto...">
        <select class="form-control" [(ngModel)]="categoryId">
          <option value="">Todas as categorias</option>
          <option *ngFor="let category of menu.categories()" [value]="category.id">{{ category.name }}</option>
        </select>
        <select class="form-control" [(ngModel)]="status">
          <option value="">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="quote">Sob orçamento</option>
          <option value="on_request">Sob consulta</option>
        </select>
      </div>
    </section>

    <section class="form-card table-card">
      <table>
        <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ordem</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let product of filteredProducts()">
            <td><strong>{{ product.name }}</strong><br><small>{{ product.shortDescription }}</small></td>
            <td>{{ categoryName(product.categoryId) }}</td>
            <td>{{ menu.getPriceLabel(product) }}</td>
            <td>
              <span class="badge" [class.success]="product.isActive" [class.danger]="!product.isActive">{{ product.isActive ? 'Ativo' : 'Inativo' }}</span>
              <span class="badge gold" *ngIf="product.isFeatured">Destaque</span>
            </td>
            <td>{{ product.displayOrder }}</td>
            <td class="table-actions">
              <a class="button-ghost" [routerLink]="['/admin/produtos', product.id]">Editar</a>
              <button class="button-ghost" (click)="duplicate(product)">Duplicar</button>
              <button class="button-danger" (click)="remove(product)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty-state" *ngIf="filteredProducts().length === 0">Nenhum produto encontrado.</div>
    </section>
  `
})
export class ProductsPageComponent {
  readonly menu = inject(MenuService);
  search = '';
  categoryId = '';
  status = '';

  filteredProducts(): Product[] {
    const term = this.search.trim().toLowerCase();
    return this.menu.products().filter((product) => {
      const matchTerm = !term || [product.name, product.shortDescription, product.pricingNote].filter(Boolean).join(' ').toLowerCase().includes(term);
      const matchCategory = !this.categoryId || product.categoryId === this.categoryId;
      const matchStatus = !this.status
        || (this.status === 'active' && product.isActive)
        || (this.status === 'inactive' && !product.isActive)
        || (this.status === 'quote' && product.availabilityStatus === 'quote')
        || (this.status === 'on_request' && product.availabilityStatus === 'on_request');
      return matchTerm && matchCategory && matchStatus;
    });
  }

  categoryName(id: string): string {
    return this.menu.getCategoryById(id)?.name ?? 'Sem categoria';
  }

  async remove(product: Product): Promise<void> {
    if (!confirm(`Excluir produto "${product.name}"?`)) return;
    await this.menu.deleteProduct(product.id);
  }

  async duplicate(product: Product): Promise<void> {
    await this.menu.duplicateProduct(product.id);
  }
}
