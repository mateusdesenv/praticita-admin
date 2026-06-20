import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MenuService } from '../../../../core/services/menu.service';
import { WhatsappService } from '../../../../core/services/whatsapp.service';
import { Product } from '../../../../core/models/product.model';
import { CurrencyBrPipe } from '../../../../shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyBrPipe],
  template: `
    <main class="page">
      <div class="container" *ngIf="product() as item; else notFound">
        <a class="button-ghost" routerLink="/">← Voltar ao cardápio</a>
        <section class="form-card" style="margin-top: 18px;">
          <div class="admin-header">
            <div>
              <h1>{{ item.name }}</h1>
              <p>{{ item.shortDescription }}</p>
            </div>
            <a class="button" [href]="whatsappUrl(item)" target="_blank" rel="noopener">Pedir pelo WhatsApp</a>
          </div>

          <p *ngIf="item.fullDescription">{{ item.fullDescription }}</p>
          <p class="price-line">{{ menu.getPriceLabel(item) }}</p>

          <div class="badges">
            <span class="badge" *ngIf="item.preparationDays">{{ item.preparationDays }} dias de antecedência</span>
            <span class="badge" *ngIf="item.minQuantity">Pedido mínimo: {{ item.minQuantity }} unidades</span>
            <span class="badge gold" *ngIf="item.pricingNote">Regra comercial</span>
          </div>

          <div class="nested-panel" *ngIf="variations().length">
            <h3>Variações</h3>
            <div class="variation-list">
              <div class="variation-item" *ngFor="let variation of variations()">
                <span>
                  <strong>{{ variation.name }}</strong>
                  <ng-container *ngIf="variation.sizeLabel"> · {{ variation.sizeLabel }}</ng-container>
                  <ng-container *ngIf="variation.weightLabel"> · {{ variation.weightLabel }}</ng-container>
                  <ng-container *ngIf="variation.servesLabel"> · {{ variation.servesLabel }}</ng-container>
                </span>
                <strong>{{ variation.price | currencyBr }}</strong>
              </div>
            </div>
          </div>

          <div class="nested-panel" *ngFor="let group of optionGroups()">
            <h3>{{ group.name }}</h3>
            <div class="badges">
              <span class="badge">Mín. {{ group.minSelect }}</span>
              <span class="badge">Máx. {{ group.maxSelect }}</span>
              <span class="badge gold" *ngIf="group.isRequired">Obrigatório</span>
            </div>
            <div class="variation-list" style="margin-top: 12px;">
              <div class="variation-item" *ngFor="let option of group.options">
                <span>{{ option.name }}</span>
                <strong *ngIf="option.additionalPrice > 0">+ {{ option.additionalPrice | currencyBr }}</strong>
              </div>
            </div>
          </div>

          <p *ngIf="item.pricingNote"><strong>Observação de preço:</strong> {{ item.pricingNote }}</p>
          <p *ngIf="item.availabilityNote"><strong>Disponibilidade:</strong> {{ item.availabilityNote }}</p>
        </section>
      </div>

      <ng-template #notFound>
        <div class="container empty-state">
          Produto não encontrado.
          <br><br>
          <a class="button" routerLink="/">Voltar ao cardápio</a>
        </div>
      </ng-template>
    </main>
  `
})
export class ProductDetailPageComponent {
  readonly menu = inject(MenuService);
  private readonly route = inject(ActivatedRoute);
  private readonly whatsapp = inject(WhatsappService);

  product(): Product | undefined {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return this.menu.getProductBySlug(slug);
  }

  variations() {
    const item = this.product();
    return item ? this.menu.getVariationsByProduct(item.id).filter((variation) => variation.isActive) : [];
  }

  optionGroups() {
    const item = this.product();
    return item ? this.menu.getOptionGroupsByProduct(item.id) : [];
  }

  whatsappUrl(product: Product): string {
    const message = this.whatsapp.buildProductMessage({ product });
    return this.whatsapp.buildUrl(this.menu.businessSettings(), message);
  }
}
