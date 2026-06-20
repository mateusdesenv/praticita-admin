import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessSettings } from '../../../../core/models/business-settings.model';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'app-business-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-header">
      <div>
        <h1>Configurações</h1>
        <p>Dados comerciais exibidos no cardápio público e usados no WhatsApp.</p>
      </div>
    </div>

    <section class="form-card">
      <div class="form-grid">
        <div class="form-field"><label>Nome comercial</label><input class="form-control" [(ngModel)]="form.businessName"></div>
        <div class="form-field"><label>Subtítulo</label><input class="form-control" [(ngModel)]="form.businessSubtitle"></div>
        <div class="form-field"><label>Slogan</label><input class="form-control" [(ngModel)]="form.slogan"></div>
        <div class="form-field"><label>WhatsApp</label><input class="form-control" [(ngModel)]="form.whatsapp"></div>
        <div class="form-field"><label>Endereço</label><input class="form-control" [(ngModel)]="form.address"></div>
        <div class="form-field"><label>Bairro</label><input class="form-control" [(ngModel)]="form.neighborhood"></div>
        <div class="form-field" style="grid-column: 1 / -1;"><label>Observação de entrega</label><textarea class="form-control" [(ngModel)]="form.deliveryNote"></textarea></div>
        <div class="form-field" style="grid-column: 1 / -1;"><label>Observação de orçamento</label><textarea class="form-control" [(ngModel)]="form.quoteNote"></textarea></div>
        <label class="checkbox-row"><input type="checkbox" [(ngModel)]="form.pickupEnabled"> Retirada ativa</label>
        <label class="checkbox-row"><input type="checkbox" [(ngModel)]="form.deliveryEnabled"> Entrega ativa</label>
      </div>
      <div class="form-actions">
        <button class="button" (click)="save()">Salvar configurações</button>
      </div>
    </section>
  `
})
export class BusinessSettingsPageComponent implements OnInit {
  readonly menu = inject(MenuService);
  form: BusinessSettings = { ...this.menu.businessSettings() };

  ngOnInit(): void {
    queueMicrotask(() => {
      this.form = { ...this.menu.businessSettings() };
    });
  }

  async save(): Promise<void> {
    await this.menu.updateBusinessSettings(this.form);
    this.form = { ...this.menu.businessSettings() };
  }
}
