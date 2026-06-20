import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../core/models/category.model';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-header">
      <div>
        <h1>Categorias</h1>
        <p>Crie, edite, ordene e ative/inative categorias do cardápio.</p>
      </div>
    </div>

    <section class="form-card">
      <h2>{{ editingId ? 'Editar categoria' : 'Nova categoria' }}</h2>
      <div class="form-grid three">
        <div class="form-field"><label>Nome</label><input class="form-control" [(ngModel)]="form.name"></div>
        <div class="form-field"><label>Slug</label><input class="form-control" [(ngModel)]="form.slug" placeholder="gerado automaticamente"></div>
        <div class="form-field"><label>Ordem</label><input class="form-control" type="number" [(ngModel)]="form.displayOrder"></div>
        <div class="form-field" style="grid-column: 1 / -1;"><label>Descrição</label><textarea class="form-control" [(ngModel)]="form.description"></textarea></div>
        <label class="checkbox-row"><input type="checkbox" [(ngModel)]="form.isActive"> Ativa</label>
      </div>
      <div class="form-actions">
        <button class="button" (click)="save()">Salvar</button>
        <button class="button-ghost" (click)="reset()" *ngIf="editingId">Cancelar</button>
      </div>
    </section>

    <section class="form-card table-card">
      <table>
        <thead><tr><th>Ordem</th><th>Nome</th><th>Slug</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          <tr *ngFor="let category of menu.categories()">
            <td>{{ category.displayOrder }}</td>
            <td><strong>{{ category.name }}</strong><br><small>{{ category.description }}</small></td>
            <td>{{ category.slug }}</td>
            <td><span class="badge" [class.success]="category.isActive" [class.danger]="!category.isActive">{{ category.isActive ? 'Ativa' : 'Inativa' }}</span></td>
            <td class="table-actions">
              <button class="button-ghost" (click)="edit(category)">Editar</button>
              <button class="button-danger" (click)="remove(category)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class CategoriesPageComponent {
  readonly menu = inject(MenuService);
  editingId: string | null = null;
  form = this.blankForm();

  blankForm() {
    return { name: '', slug: '', description: '', displayOrder: this.menu.categories().length + 1, isActive: true };
  }

  edit(category: Category): void {
    this.editingId = category.id;
    this.form = { name: category.name, slug: category.slug, description: category.description ?? '', displayOrder: category.displayOrder, isActive: category.isActive };
  }

  async save(): Promise<void> {
    if (!this.form.name.trim()) return alert('Informe o nome da categoria.');

    if (this.editingId) {
      await this.menu.updateCategory(this.editingId, this.form);
    } else {
      await this.menu.createCategory({ ...this.form, parentId: null, imageUrl: null });
    }
    this.reset();
  }

  async remove(category: Category): Promise<void> {
    if (!confirm(`Excluir categoria "${category.name}"?`)) return;
    try {
      await this.menu.deleteCategory(category.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao excluir categoria.');
    }
  }

  reset(): void {
    this.editingId = null;
    this.form = this.blankForm();
  }
}
