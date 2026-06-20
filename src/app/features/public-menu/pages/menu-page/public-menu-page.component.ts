import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../../core/services/menu.service';
import { WhatsappService } from '../../../../core/services/whatsapp.service';
import { ProductVariation } from '../../../../core/models/product-variation.model';
import { Product } from '../../../../core/models/product.model';
import { CurrencyBrPipe } from '../../../../shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-public-menu-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyBrPipe],
  template: `
    <main class="page">
      <div class="container">
        <section class="hero">
          <div class="hero-grid">
            <div class="hero-content">
              <span class="hero-kicker">{{ settings().slogan }}</span>
              <h1>Cozinha para todas as horas.</h1>
              <p>Cardápio online da {{ settings().businessName }} {{ settings().businessSubtitle }}. Escolha seus produtos, confira as regras de encomenda e finalize o contato pelo WhatsApp.</p>
              <div class="hero-actions">
                <a class="button-secondary" href="#cardapio">Ver cardápio</a>
                <a class="button" [href]="directWhatsappUrl()" target="_blank" rel="noopener">Pedir pelo WhatsApp</a>
              </div>
            </div>
            <div class="hero-media" role="img" aria-label="Dani e Cleu da Praticità"></div>
          </div>
        </section>
      </div>

      <nav id="cardapio" class="category-nav" aria-label="Categorias do cardápio">
        <div class="container category-nav-scroll">
          <a class="category-pill" *ngFor="let section of sections()" [href]="'#' + section.slug">{{ section.name }}</a>
        </div>
      </nav>

      <div class="container">
        <div class="section-title">
          <div>
            <h2>Cardápio</h2>
            <p>Dados iniciais carregados do cardápio atual. O admin permite editar tudo e persistir no localStorage.</p>
          </div>
        </div>

        <div class="search-card">
          <input class="search-input" type="search" [(ngModel)]="search" placeholder="Buscar por bolo, salgado, brownie, coffee break...">
        </div>

        <section *ngFor="let section of sections()" [id]="section.slug">
          <div class="section-title">
            <div>
              <h2>{{ section.name }}</h2>
              <p>{{ section.description }}</p>
            </div>
            <span class="badge gold">{{ section.products.length }} itens</span>
          </div>

          <div class="products-grid">
            <article class="product-card" *ngFor="let product of section.products" [class.featured]="product.isFeatured">
              <div class="product-top">
                <div>
                  <h3>{{ product.name }}</h3>
                  <p *ngIf="product.shortDescription">{{ product.shortDescription }}</p>
                </div>
                <span class="badge gold" *ngIf="product.isFeatured">Destaque</span>
              </div>

              <div class="price-line">{{ menu.getPriceLabel(product) }}</div>

              <div class="badges">
                <span class="badge" *ngIf="product.preparationDays">{{ product.preparationDays }} dias de antecedência</span>
                <span class="badge" *ngIf="product.minQuantity">Mín. {{ product.minQuantity }} un.</span>
                <span class="badge success" *ngIf="product.availabilityStatus === 'available'">Disponível</span>
                <span class="badge" *ngIf="product.availabilityStatus === 'on_request'">Sob consulta</span>
                <span class="badge gold" *ngIf="product.availabilityStatus === 'quote'">Orçamento</span>
              </div>

              <div class="variation-list" *ngIf="product.variations.length">
                <div class="variation-item" *ngFor="let variation of product.variations">
                  <span>
                    <strong>{{ variation.name }}</strong>
                    <ng-container *ngIf="variation.sizeLabel"> · {{ variation.sizeLabel }}</ng-container>
                    <ng-container *ngIf="variation.servesLabel"> · {{ variation.servesLabel }}</ng-container>
                  </span>
                  <strong>{{ variation.price | currencyBr }}</strong>
                </div>
              </div>

              <p *ngIf="product.pricingNote"><strong>Obs.:</strong> {{ product.pricingNote }}</p>
              <p *ngIf="product.availabilityNote"><strong>Status:</strong> {{ product.availabilityNote }}</p>

              <div class="card-footer">
                <a class="button" [href]="whatsappUrl(product)" target="_blank" rel="noopener">{{ product.priceType === 'quote' ? 'Solicitar orçamento' : 'Pedir' }}</a>
                <a class="button-ghost" [routerLink]="['/produto', product.slug]">Detalhes</a>
              </div>
            </article>
          </div>
        </section>

        <section class="info-strip">
          <div class="info-box">
            <strong>Retirada</strong>
            <span>{{ settings().address }} — {{ settings().neighborhood }}</span>
          </div>
          <div class="info-box">
            <strong>Entrega</strong>
            <span>{{ settings().deliveryNote }}</span>
          </div>
          <div class="info-box">
            <strong>Contato</strong>
            <span>{{ settings().whatsapp }}</span>
          </div>
        </section>
      </div>
    </main>
  `
})
export class PublicMenuPageComponent {
  readonly menu = inject(MenuService);
  private readonly whatsapp = inject(WhatsappService);
  search = '';

  settings = this.menu.businessSettings;

  sections() {
    return this.menu.getPublicSections(this.search);
  }

  whatsappUrl(product: Product, variation?: ProductVariation): string {
    const message = this.whatsapp.buildProductMessage({ product, variation });
    return this.whatsapp.buildUrl(this.settings(), message);
  }

  directWhatsappUrl(): string {
    return this.whatsapp.buildUrl(this.settings(), 'Olá, vim pelo cardápio online da Praticità e gostaria de fazer um pedido.');
  }
}
