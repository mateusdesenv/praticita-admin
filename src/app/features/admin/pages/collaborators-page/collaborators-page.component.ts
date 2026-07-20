import { Component, HostListener, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Collaborator,
  CollaboratorRole,
  CollaboratorsService,
  Permissions,
  PermissionScreen
} from '../../../../core/services/collaborators.service';
import { AuthService } from '../../../../core/services/auth.service';

const SCREENS: Array<{ key: PermissionScreen; label: string }> = [
  { key: 'dashboard', label: 'Visão geral' },
  { key: 'categories', label: 'Categorias' },
  { key: 'products', label: 'Produtos' },
  { key: 'collaborators', label: 'Colaboradores' },
  { key: 'settings', label: 'Configurações' },
  { key: 'backup', label: 'Dados e backup' }
];

@Component({
  selector: 'app-collaborators-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="admin-header">
      <div class="admin-heading">
        <span class="eyebrow">Equipe e acessos</span>
        <h1>Colaboradores</h1>
        <p>Gerencie pessoas, níveis de cadastro e permissões de leitura e escrita do painel.</p>
      </div>
    </header>

    @if (message()) { <div class="system-alert success" role="status">{{ message() }}</div> }
    @if (error()) { <div class="system-alert danger" role="alert">{{ error() }}</div> }

    <section class="card table-card collaborators-table">
      @if (loading()) {
        <div class="empty-state">Carregando colaboradores...</div>
      } @else if (!collaborators().length) {
        <div class="empty-state"><strong>Nenhum acesso cadastrado</strong><span>Use o botão + para cadastrar a primeira pessoa.</span></div>
      } @else {
        <table>
          <thead><tr><th>Pessoa</th><th>Login</th><th>Nível</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            @for (item of collaborators(); track item.id) {
              <tr>
                <td>
                  <div class="admin-product-cell">
                    <span class="collaborator-avatar">
                      @if (item.photoURL) { <img [src]="item.photoURL" alt=""> }
                      @else { {{ item.name.charAt(0).toUpperCase() }} }
                    </span>
                    <span><strong>{{ item.name }}</strong><br><small>{{ item.provider === 'google' ? 'Conta Google' : 'CPF e senha' }}</small></span>
                  </div>
                </td>
                <td>{{ item.email || formatCpf(item.cpf) }}</td>
                <td><span class="role-badge">{{ roleLabel(item.role) }}</span></td>
                <td><span class="badge" [class.success]="item.isActive">{{ item.isActive ? 'Ativo' : 'Inativo' }}</span></td>
                <td>
                  @if (auth.canWrite('collaborators')) {
                    <button class="button-ghost" type="button" (click)="edit(item)">Editar acesso</button>
                  } @else { <small>Somente leitura</small> }
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>

    @if (auth.canWrite('collaborators')) { <button class="collaborator-fab" type="button" (click)="openNew()" aria-label="Cadastrar novo colaborador" title="Novo colaborador">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>
      <span>Novo colaborador</span>
    </button> }

    @if (modalOpen()) {
      <div class="admin-modal-backdrop" role="presentation" (mousedown)="backdropClick($event)">
        <section class="admin-modal collaborator-modal" role="dialog" aria-modal="true" aria-labelledby="collaborator-modal-title">
          <header class="admin-modal-header">
            <div>
              <span class="eyebrow">{{ editingId ? 'Editar acesso' : 'Novo acesso' }}</span>
              <h2 id="collaborator-modal-title">{{ editingId ? 'Configurar colaborador' : 'Cadastrar colaborador' }}</h2>
            </div>
            <button class="admin-modal-close" type="button" (click)="closeModal()" aria-label="Fechar">×</button>
          </header>

          <div class="admin-modal-body">
            <div class="collaborator-form-grid">
              <div class="form-field">
                <label for="collaborator-name">Nome</label>
                <input id="collaborator-name" class="form-control" [(ngModel)]="form.name" autocomplete="name" maxlength="120">
              </div>
              @if (form.provider === 'cpf') {
                <div class="form-field">
                  <label for="collaborator-cpf">Usuário (CPF)</label>
                  <input id="collaborator-cpf" class="form-control" [ngModel]="form.cpf" (ngModelChange)="setCpf($event)"
                    inputmode="numeric" autocomplete="username" maxlength="14" placeholder="000.000.000-00">
                </div>
                <div class="form-field">
                  <label for="collaborator-password">Senha {{ editingId ? '(opcional)' : '' }}</label>
                  <input id="collaborator-password" class="form-control" type="password" [(ngModel)]="form.password"
                    autocomplete="new-password" minlength="6" maxlength="128" placeholder="Mínimo de 6 caracteres">
                </div>
              } @else {
                <div class="form-field">
                  <label>E-mail Google</label>
                  <input class="form-control" [value]="form.email" disabled>
                </div>
              }
              <div class="form-field">
                <label for="collaborator-role">Categoria</label>
                <select id="collaborator-role" class="form-control" [(ngModel)]="form.role" (ngModelChange)="applyRolePreset($event)">
                  <option value="admin">Admin</option>
                  <option value="cozinheiro">Cozinheiro</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>
            </div>

            <div class="permission-section">
              <div class="permission-heading">
                <div><span class="eyebrow">Permissões por tela</span><h3>Defina o que essa pessoa pode fazer</h3></div>
                <small>Escrita também exige acesso de leitura.</small>
              </div>
              <div class="permission-matrix">
                <div class="permission-row permission-row-head"><strong>Tela</strong><span>Leitura</span><span>Escrita</span></div>
                @for (screen of screens; track screen.key) {
                  <div class="permission-row">
                    <strong>{{ screen.label }}</strong>
                    <label class="permission-check"><input type="checkbox" [(ngModel)]="form.permissions[screen.key].read" (change)="readChanged(screen.key)"><span>Permitir leitura</span></label>
                    <label class="permission-check"><input type="checkbox" [(ngModel)]="form.permissions[screen.key].write" (change)="writeChanged(screen.key)"><span>Permitir escrita</span></label>
                  </div>
                }
              </div>
            </div>

            @if (editingId) {
              <label class="checkbox-row"><input type="checkbox" [(ngModel)]="form.isActive"> Acesso ativo</label>
            }
            @if (modalError()) { <p class="admin-login-error" role="alert">{{ modalError() }}</p> }
          </div>

          <footer class="admin-modal-footer">
            @if (editingId && form.provider === 'cpf') {
              <button class="button-danger" type="button" (click)="removeCurrent()">Excluir</button>
            }
            <span class="modal-footer-spacer"></span>
            <button class="button-ghost" type="button" (click)="closeModal()">Cancelar</button>
            <button class="button" type="button" (click)="save()" [disabled]="saving()">{{ saving() ? 'Salvando...' : 'Salvar acesso' }}</button>
          </footer>
        </section>
      </div>
    }
  `
})
export class CollaboratorsPageComponent implements OnInit {
  readonly screens = SCREENS;
  readonly collaborators = signal<Collaborator[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly modalOpen = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly modalError = signal('');
  editingId: string | null = null;
  form = this.blankForm();

  constructor(private readonly service: CollaboratorsService, readonly auth: AuthService) {}
  ngOnInit(): void { void this.load(); }

  @HostListener('document:keydown.escape')
  escape(): void { if (this.modalOpen()) this.closeModal(); }

  async load(): Promise<void> {
    this.loading.set(true);
    try { this.collaborators.set(await this.service.list()); }
    catch (error) { this.error.set(error instanceof Error ? error.message : 'Não foi possível carregar.'); }
    finally { this.loading.set(false); }
  }

  openNew(): void {
    this.editingId = null;
    this.form = this.blankForm();
    this.modalError.set('');
    this.modalOpen.set(true);
  }

  edit(item: Collaborator): void {
    this.editingId = item.id;
    this.form = {
      name: item.name,
      cpf: this.formatCpf(item.cpf),
      email: item.email || '',
      password: '',
      provider: item.provider,
      role: item.role,
      permissions: structuredClone(item.permissions),
      isActive: item.isActive
    };
    this.modalError.set('');
    this.modalOpen.set(true);
  }

  closeModal(): void { this.modalOpen.set(false); }
  backdropClick(event: MouseEvent): void { if (event.target === event.currentTarget) this.closeModal(); }

  setCpf(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    this.form.cpf = digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4').replace(/[-.]$/, '');
  }

  applyRolePreset(role: CollaboratorRole): void {
    this.form.role = role;
    this.form.permissions = this.permissionsFor(role);
  }

  readChanged(screen: PermissionScreen): void {
    if (!this.form.permissions[screen].read) this.form.permissions[screen].write = false;
  }

  writeChanged(screen: PermissionScreen): void {
    if (this.form.permissions[screen].write) this.form.permissions[screen].read = true;
  }

  async save(): Promise<void> {
    this.modalError.set('');
    if (!this.form.name.trim()) return this.modalError.set('Informe o nome.');
    if (this.form.provider === 'cpf' && this.form.cpf.replace(/\D/g, '').length !== 11) return this.modalError.set('Informe um CPF completo.');
    if (!this.editingId && this.form.password.length < 6) return this.modalError.set('A senha deve ter no mínimo 6 caracteres.');
    this.saving.set(true);
    try {
      const payload = {
        name: this.form.name,
        cpf: this.form.provider === 'cpf' ? this.form.cpf.replace(/\D/g, '') : undefined,
        password: this.form.password || undefined,
        role: this.form.role,
        permissions: this.form.permissions,
        isActive: this.form.isActive
      };
      if (this.editingId) await this.service.update(this.editingId, payload);
      else await this.service.create(payload);
      this.message.set(this.editingId ? 'Acesso atualizado.' : 'Colaborador cadastrado.');
      this.closeModal();
      await this.load();
    } catch (error) {
      this.modalError.set(error instanceof Error ? error.message : 'Não foi possível salvar.');
    } finally { this.saving.set(false); }
  }

  async removeCurrent(): Promise<void> {
    const item = this.collaborators().find((candidate) => candidate.id === this.editingId);
    if (!item || !confirm(`Excluir o acesso de ${item.name}?`)) return;
    try {
      await this.service.remove(item.id);
      this.closeModal();
      this.message.set('Colaborador excluído.');
      await this.load();
    } catch (error) { this.modalError.set(error instanceof Error ? error.message : 'Não foi possível excluir.'); }
  }

  formatCpf(cpf: string | null): string {
    return cpf?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') || '—';
  }

  roleLabel(role: CollaboratorRole): string {
    return { admin: 'Admin', cozinheiro: 'Cozinheiro', financeiro: 'Financeiro' }[role];
  }

  private blankForm() {
    return {
      name: '', cpf: '', email: '', password: '', provider: 'cpf' as 'cpf' | 'google',
      role: 'cozinheiro' as CollaboratorRole, permissions: this.permissionsFor('cozinheiro'), isActive: true
    };
  }

  private permissionsFor(role: CollaboratorRole): Permissions {
    const all = Object.fromEntries(this.screens.map(({ key }) => [key, { read: true, write: true }])) as Permissions;
    if (role === 'admin') return all;
    for (const screen of this.screens) all[screen.key] = { read: false, write: false };
    if (role === 'cozinheiro') {
      all.dashboard.read = true;
      all.categories.read = true;
      all.products = { read: true, write: true };
    } else {
      all.dashboard.read = true;
      all.products.read = true;
      all.settings.read = true;
      all.backup.read = true;
    }
    return all;
  }
}
