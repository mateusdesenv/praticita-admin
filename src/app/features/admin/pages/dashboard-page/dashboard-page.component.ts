import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-header dashboard-header">
      <div class="admin-heading">
        <span class="eyebrow">Visão geral</span>
        <h1>Olá, Praticità</h1>
        <p>Acompanhe o cardápio e mantenha sua vitrine sempre pronta para receber pedidos.</p>
      </div>
      <div class="admin-header-actions">
        <a class="button-ghost" routerLink="/">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5.5 0 9.7 5 10 5.4l.5.6-.5.6C21.7 12 17.5 17 12 17S2.3 12 2 11.6l-.5-.6.5-.6C2.3 10 6.5 5 12 5Zm0 2c-3.6 0-6.7 2.8-7.8 4 1.1 1.2 4.2 4 7.8 4s6.7-2.8 7.8-4c-1.1-1.2-4.2-4-7.8-4Z"/></svg>
          Ver cardápio
        </a>
        <a class="button" routerLink="/admin/produtos/novo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>
          Novo produto
        </a>
      </div>
    </div>

    <section class="system-alert error" *ngIf="menu.loadError()" role="alert">
      <span class="alert-icon" aria-hidden="true">!</span>
      <div>
        <strong>Não foi possível sincronizar o cardápio</strong>
        <p>{{ menu.loadError() }}</p>
      </div>
      <button class="button-ghost" type="button" (click)="menu.load()">Tentar novamente</button>
    </section>

    <section class="system-alert loading" *ngIf="menu.isLoading()" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <div>
        <strong>Sincronizando cardápio</strong>
        <p>Buscando os dados mais recentes da sua operação.</p>
      </div>
    </section>

    <section class="stats-grid" aria-label="Indicadores do cardápio">
      <article class="stat-card stat-card-primary">
        <div class="stat-card-top">
          <span class="stat-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 2.3L6.2 8.5 12 11.7l5.8-3.2L12 5.3Z"/></svg></span>
          <span class="trend-badge">{{ activeRate() }}% ativos</span>
        </div>
        <span>Total de produtos</span>
        <strong>{{ products().length }}</strong>
        <small>Itens cadastrados no cardápio</small>
      </article>
      <article class="stat-card">
        <span class="stat-icon soft-green"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 16.2-4.2-4.2 1.4-1.4 2.8 2.8 7.8-7.8 1.4 1.4-9.2 9.2Z"/></svg></span>
        <span>Produtos ativos</span>
        <strong>{{ activeProducts() }}</strong>
        <small>Visíveis para seus clientes</small>
      </article>
      <article class="stat-card">
        <span class="stat-icon soft-gold"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 17h2v-1h1a3 3 0 0 0 0-6h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1h2a3 3 0 0 0-3-3h-1V5h-2v1h-1a3 3 0 0 0 0 6h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1H7a3 3 0 0 0 3 3h1v1Z"/></svg></span>
        <span>Sob orçamento</span>
        <strong>{{ quoteProducts() }}</strong>
        <small>Itens com preço personalizado</small>
      </article>
      <article class="stat-card">
        <span class="stat-icon soft-rose"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v6H4V5Zm9 0h7v6h-7V5ZM4 13h7v6H4v-6Zm9 0h7v6h-7v-6Z"/></svg></span>
        <span>Categorias</span>
        <strong>{{ categories().length }}</strong>
        <small>Seções organizadas no menu</small>
      </article>
    </section>

    <div class="dashboard-grid">
      <section class="admin-card dashboard-panel">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">Operação</span>
            <h2>Panorama do cardápio</h2>
          </div>
          <a routerLink="/admin/produtos">Gerenciar produtos</a>
        </div>

        <div class="metric-list">
          <div class="metric-row">
            <span class="metric-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-1-7h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.9 3.5 7 5.6 5.6 7 3.5 4.9l1.4-1.4Zm13.5 13.5 2.1 2.1-1.4 1.4-2.1-2.1 1.4-1.4ZM19.1 3.5l1.4 1.4L18.4 7 17 5.6l2.1-2.1ZM5.6 17 7 18.4l-2.1 2.1-1.4-1.4L5.6 17Z"/></svg></span>
            <span><strong>{{ withPreparation() }}</strong><small>exigem antecedência</small></span>
          </div>
          <div class="metric-row">
            <span class="metric-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5V4Zm2 2v12h10V6H7Zm2 2h6v2H9V8Zm0 4h6v2H9v-2Z"/></svg></span>
            <span><strong>{{ withMinQuantity() }}</strong><small>possuem pedido mínimo</small></span>
          </div>
          <div class="metric-row">
            <span class="metric-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-1 3h2v6h-2V7Zm0 8h2v2h-2v-2Z"/></svg></span>
            <span><strong>{{ onRequest() }}</strong><small>estão sob consulta</small></span>
          </div>
          <div class="metric-row">
            <span class="metric-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v2H6V4Zm-2 4h16v12H4V8Zm2 2v8h12v-8H6Zm2 2h3v2H8v-2Z"/></svg></span>
            <span><strong>{{ menu.variations().length }}</strong><small>variações cadastradas</small></span>
          </div>
        </div>
      </section>

      <section class="admin-card dashboard-panel quick-actions">
        <div class="panel-heading">
          <div>
            <span class="eyebrow">Atalhos</span>
            <h2>Ações rápidas</h2>
          </div>
        </div>
        <a routerLink="/admin/produtos/novo">
          <span class="quick-action-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg></span>
          <span><strong>Adicionar produto</strong><small>Cadastre um novo item no cardápio</small></span>
          <span aria-hidden="true">›</span>
        </a>
        <a routerLink="/admin/categorias">
          <span class="quick-action-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v6H4V5Zm9 0h7v6h-7V5ZM4 13h7v6H4v-6Zm9 0h7v6h-7v-6Z"/></svg></span>
          <span><strong>Organizar categorias</strong><small>Ajuste seções, ordem e visibilidade</small></span>
          <span aria-hidden="true">›</span>
        </a>
        <a routerLink="/admin/configuracoes">
          <span class="quick-action-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v2H4V5Zm0 6h16v2H4v-2Zm0 6h16v2H4v-2ZM7 3h2v6H7V3Zm8 6h2v6h-2V9Zm-6 6h2v6H9v-6Z"/></svg></span>
          <span><strong>Editar informações</strong><small>Atualize atendimento e entregas</small></span>
          <span aria-hidden="true">›</span>
        </a>
      </section>
    </div>

    <section class="sync-card" [class.sync-warning]="menu.isLoading()" [class.sync-error]="menu.loadError()">
      <span class="sync-card-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 0 1 7.4 5H17l3.5 3.5L24 9h-2.5A10 10 0 0 0 4 6.3l1.5 1.3A8 8 0 0 1 12 4Zm-8 8.5L0 16h2.5A10 10 0 0 0 20 17.7l-1.5-1.3A8 8 0 0 1 4.6 15H7l-3-2.5Z"/></svg>
      </span>
      <div>
        <strong>{{ menu.loadError() ? 'Sincronização indisponível' : menu.isLoading() ? 'Conectando à nuvem' : 'Cardápio conectado à nuvem' }}</strong>
        <p>{{ menu.loadError() ? 'Confira a conexão e tente sincronizar novamente.' : menu.isLoading() ? 'Validando a conexão com a API do cardápio.' : 'Alterações feitas no painel são salvas na API e refletidas no cardápio online.' }}</p>
      </div>
      <span class="badge" [class.success]="!menu.isLoading() && !menu.loadError()" [class.danger]="menu.loadError()">
        {{ menu.loadError() ? 'Atenção' : menu.isLoading() ? 'Conectando' : 'API ativa' }}
      </span>
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
  activeRate() {
    return this.products().length ? Math.round((this.activeProducts() / this.products().length) * 100) : 0;
  }
}
