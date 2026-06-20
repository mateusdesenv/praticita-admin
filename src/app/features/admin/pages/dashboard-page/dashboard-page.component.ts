import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-header">
      <div>
        <h1>Dashboard</h1>
        <p>Resumo local do cardápio salvo no navegador.</p>
      </div>
      <a class="button" routerLink="/admin/produtos/novo">Novo produto</a>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><span>Produtos</span><strong>{{ products().length }}</strong></div>
      <div class="stat-card"><span>Produtos ativos</span><strong>{{ activeProducts() }}</strong></div>
      <div class="stat-card"><span>Sob orçamento</span><strong>{{ quoteProducts() }}</strong></div>
      <div class="stat-card"><span>Categorias</span><strong>{{ categories().length }}</strong></div>
      <div class="stat-card"><span>Com antecedência</span><strong>{{ withPreparation() }}</strong></div>
      <div class="stat-card"><span>Pedido mínimo</span><strong>{{ withMinQuantity() }}</strong></div>
      <div class="stat-card"><span>Sob consulta</span><strong>{{ onRequest() }}</strong></div>
      <div class="stat-card"><span>Variações</span><strong>{{ menu.variations().length }}</strong></div>
    </div>

    <section class="form-card" style="margin-top: 18px;">
      <h2>Persistência atual</h2>
      <p>Etapa 1 ativa: os dados estão sendo persistidos em <strong>localStorage</strong>. A estrutura já está preparada para trocar o repositório por HTTP na etapa Node.js + MongoDB.</p>
    </section>
  `
})
export class DashboardPageComponent {
  readonly menu = inject(MenuService);
  categories = this.menu.categories;
  products = this.menu.products;

  activeProducts() { return this.products().filter((product) => product.isActive).length; }
  quoteProducts() { return this.products().filter((product) => product.priceType === 'quote' || product.availabilityStatus === 'quote').length; }
  withPreparation() { return this.products().filter((product) => !!product.preparationDays).length; }
  withMinQuantity() { return this.products().filter((product) => !!product.minQuantity).length; }
  onRequest() { return this.products().filter((product) => product.availabilityStatus === 'on_request').length; }
}
