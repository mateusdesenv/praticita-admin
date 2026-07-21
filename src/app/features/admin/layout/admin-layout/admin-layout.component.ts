import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <a class="skip-link" href="#admin-content">Ir para o conteúdo principal</a>

    <main class="admin-page">
      <div class="admin-layout">
        <aside class="admin-sidebar" aria-label="Navegação administrativa">
          <div class="admin-brand">
            <span class="admin-brand-mark" aria-hidden="true">
              <img src="/assets/praticita/logo.png" alt="">
            </span>
            <span>
              <strong>Praticità</strong>
              <small>Central de gestão</small>
            </span>
          </div>

          <div class="admin-workspace">
            <span class="status-dot" aria-hidden="true"></span>
            <span>
              <small>Espaço de trabalho</small>
              <strong>Doces e Salgados</strong>
            </span>
          </div>

          <nav aria-label="Seções do painel">
            @if (auth.canRead('dashboard')) { <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z"/></svg>
              <span>Visão geral</span>
            </a> }

            @if (auth.canRead('operations')) {
              <section class="admin-nav-group" [class.open]="openGroups.operations" [class.current]="isGroupActive('operations')">
                <button type="button" class="admin-nav-group-trigger" (click)="toggleGroup('operations')" [attr.aria-expanded]="openGroups.operations" aria-controls="admin-nav-operations">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v4H4V4Zm0 6h7v10H4V10Zm9 0h7v5h-7v-5Zm0 7h7v3h-7v-3ZM6 6v0h12v0H6Zm0 6v6h3v-6H6Z"/></svg>
                  <span>Operação</span><svg class="admin-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5H7Z"/></svg>
                </button>
                <div class="admin-nav-submenu" id="admin-nav-operations" [attr.hidden]="openGroups.operations ? null : ''">
                  <a routerLink="/admin/operacao/pedidos" routerLinkActive="active"><svg viewBox="0 0 24 24"><path d="M5 3h14v18H5V3Zm2 2v14h10V5H7Zm2 3h6v2H9V8Zm0 4h6v2H9v-2Z"/></svg><span>Pedidos</span></a>
                  <a routerLink="/admin/operacao/agenda" routerLinkActive="active"><svg viewBox="0 0 24 24"><path d="M7 2h2v3h6V2h2v3h3v17H4V5h3V2ZM6 9v11h12V9H6Zm2 2h3v3H8v-3Z"/></svg><span>Agenda</span></a>
                  <a routerLink="/admin/operacao/producao" routerLinkActive="active"><svg viewBox="0 0 24 24"><path d="M4 18h16v3H4v-3Zm2-2c0-4 2-7 6-8V5h-2V3h4v5c4 1 6 4 6 8H6Zm2-2h10c-.6-2.6-2.5-4-5-4s-4.4 1.4-5 4Z"/></svg><span>Produção</span></a>
                  <a routerLink="/admin/operacao/clientes" routerLinkActive="active"><svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-4 3-7 7-7s7 3 7 7H5Z"/></svg><span>Clientes</span></a>
                </div>
              </section>
            }

            @if (auth.canRead('categories') || auth.canRead('products')) {
              <section class="admin-nav-group" [class.open]="openGroups.catalog" [class.current]="isGroupActive('catalog')">
                <button type="button" class="admin-nav-group-trigger" (click)="toggleGroup('catalog')" [attr.aria-expanded]="openGroups.catalog" aria-controls="admin-nav-catalog">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h7l2 2h9v12H3V5Zm2 2v10h14V9h-8l-2-2H5Z"/></svg>
                  <span>Catálogo</span><svg class="admin-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5H7Z"/></svg>
                </button>
                <div class="admin-nav-submenu" id="admin-nav-catalog" [attr.hidden]="openGroups.catalog ? null : ''">
                  @if (auth.canRead('categories')) { <a routerLink="/admin/categorias" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v6H4V5Zm9 0h7v6h-7V5ZM4 13h7v6H4v-6Zm9 0h7v6h-7v-6Z"/></svg><span>Categorias</span></a> }
                  @if (auth.canRead('products')) { <a routerLink="/admin/produtos" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 2.3L6.2 8.5 12 11.7l5.8-3.2L12 5.3Zm-6 4.9v5.1l5 2.8V13l-5-2.8Zm7 7.9 5-2.8v-5.1L13 13v5.1Z"/></svg><span>Produtos</span></a> }
                </div>
              </section>
            }

            @if (auth.canRead('finance')) {
              <section class="admin-nav-group" [class.open]="openGroups.finance" [class.current]="isGroupActive('finance')">
                <button type="button" class="admin-nav-group-trigger" (click)="toggleGroup('finance')" [attr.aria-expanded]="openGroups.finance" aria-controls="admin-nav-finance">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 3h8v2H8v-2Z"/></svg>
                  <span>Financeiro</span><svg class="admin-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5H7Z"/></svg>
                </button>
                <div class="admin-nav-submenu" id="admin-nav-finance" [attr.hidden]="openGroups.finance ? null : ''">
                  <a routerLink="/admin/financeiro/contas-a-pagar" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4V4Zm2 2v12h12V6H6Zm3 3h6v2H9V9Zm0 4h6v2H9v-2Z"/></svg><span>Contas a pagar</span></a>
                  <a routerLink="/admin/financeiro/contas-a-receber" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4h2v3h3v2h-3v3h-2V9H8V7h3V4ZM5 13h14v7H5v-7Zm2 2v3h10v-3H7Z"/></svg><span>Contas a receber</span></a>
                  <a routerLink="/admin/financeiro/notas-fiscais-entrada" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l4 4v16H6V2Zm2 2v16h9V7h-3V4H8Zm2 7h5v2h-5v-2Zm0 4h5v2h-5v-2Z"/></svg><span>Notas fiscais</span></a>
                </div>
              </section>
            }

            @if (auth.canRead('collaborators') || auth.canRead('settings') || auth.canRead('backup')) {
              <section class="admin-nav-group" [class.open]="openGroups.admin" [class.current]="isGroupActive('admin')">
                <button type="button" class="admin-nav-group-trigger" (click)="toggleGroup('admin')" [attr.aria-expanded]="openGroups.admin" aria-controls="admin-nav-administration">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v5c0 5.1 3.4 9.4 8 10 4.6-.6 8-4.9 8-10V6l-8-3Zm0 2.1L18 7v4c0 4-2.5 7.3-6 8-3.5-.7-6-4-6-8V7l6-1.9Z"/></svg>
                  <span>Administração</span><svg class="admin-nav-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5H7Z"/></svg>
                </button>
                <div class="admin-nav-submenu" id="admin-nav-administration" [attr.hidden]="openGroups.admin ? null : ''">
                  @if (auth.canRead('collaborators')) { <a routerLink="/admin/colaboradores" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3ZM8 11c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Zm0 2c-2.3 0-7 1.2-7 3.5V19h10v-2.5c0-.8.3-1.6.8-2.2C10.5 13.4 9 13 8 13Zm8 0c-.9 0-1.9.2-2.8.5 1.1.8 1.8 1.8 1.8 3V19h8v-2.5c0-2.3-4.7-3.5-7-3.5Z"/></svg><span>Colaboradores</span></a> }
                  @if (auth.canRead('settings')) { <a routerLink="/admin/configuracoes" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 4c0-.6-.1-1.2-.2-1.8l2-1.6-2-3.4-2.4 1a9.4 9.4 0 0 0-3.1-1.8L15 2h-4l-.4 2.4a9.4 9.4 0 0 0-3.1 1.8l-2.4-1-2 3.4 2 1.6A9.8 9.8 0 0 0 5 12c0 .6.1 1.2.2 1.8l-2 1.6 2 3.4 2.4-1a9.4 9.4 0 0 0 3.1 1.8L11 22h4l.4-2.4a9.4 9.4 0 0 0 3.1-1.8l2.4 1 2-3.4-2-1.6c.1-.6.2-1.2.2-1.8Zm-9 6a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"/></svg><span>Configurações</span></a> }
                  @if (auth.canRead('backup')) { <a routerLink="/admin/importar-exportar" routerLinkActive="active"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 15V6.8L8.4 9.4 7 8l5-5 5 5-1.4 1.4L13 6.8V15h-2Zm-6 6a2 2 0 0 1-2-2v-5h2v5h14v-5h2v5a2 2 0 0 1-2 2H5Z"/></svg><span>Dados e backup</span></a> }
                </div>
              </section>
            }
          </nav>

          <a class="admin-public-link" routerLink="/">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c5.5 0 9.7 5 10 5.4l.5.6-.5.6C21.7 12 17.5 17 12 17S2.3 12 2 11.6l-.5-.6.5-.6C2.3 10 6.5 5 12 5Zm0 2c-3.6 0-6.7 2.8-7.8 4 1.1 1.2 4.2 4 7.8 4s6.7-2.8 7.8-4c-1.1-1.2-4.2-4-7.8-4Zm0 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"/></svg>
            <span>Visualizar cardápio</span>
            <svg class="external-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>
          </a>

          <div class="admin-user">
            @if (auth.user(); as user) {
              @if (user.photoURL) {
                <img [src]="user.photoURL" alt="">
              } @else {
                <span class="admin-user-fallback" aria-hidden="true">{{ user.displayName.charAt(0) || 'P' }}</span>
              }
              <span>
                <strong>{{ user.displayName || 'Conta Google' }}</strong>
                <small>{{ user.email }}</small>
              </span>
              <button type="button" (click)="logout()" aria-label="Sair do painel" title="Sair">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17v2H5V5h5v2H7v10h3Zm4.6-9.4L19 12l-4.4 4.4-1.4-1.4 2-2H9v-2h6.2l-2-2 1.4-1.4Z"/></svg>
              </button>
            }
          </div>
        </aside>

        <section class="admin-content" id="admin-content" tabindex="-1">
          <router-outlet />
        </section>
      </div>
    </main>
  `
})
export class AdminLayoutComponent {
  readonly openGroups = { operations: true, catalog: true, finance: true, admin: true };

  constructor(
    readonly auth: AuthService,
    private readonly router: Router
  ) {
    if (this.router.url.startsWith('/admin/financeiro')) this.openGroups.finance = true;
    if (this.router.url.startsWith('/admin/operacao')) this.openGroups.operations = true;
    if (['/admin/colaboradores', '/admin/configuracoes', '/admin/importar-exportar'].some((path) => this.router.url.startsWith(path))) this.openGroups.admin = true;
  }

  toggleGroup(group: keyof typeof this.openGroups): void {
    this.openGroups[group] = !this.openGroups[group];
  }

  isGroupActive(group: keyof typeof this.openGroups): boolean {
    const url = this.router.url;
    if (group === 'operations') return url.startsWith('/admin/operacao');
    if (group === 'catalog') return url.startsWith('/admin/categorias') || url.startsWith('/admin/produtos');
    if (group === 'finance') return url.startsWith('/admin/financeiro');
    return ['/admin/colaboradores', '/admin/configuracoes', '/admin/importar-exportar'].some((path) => url.startsWith(path));
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/admin/login']);
  }
}
