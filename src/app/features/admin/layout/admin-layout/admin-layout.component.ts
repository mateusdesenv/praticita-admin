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
            <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z"/></svg>
              <span>Visão geral</span>
            </a>
            <a routerLink="/admin/categorias" routerLinkActive="active">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h7v6H4V5Zm9 0h7v6h-7V5ZM4 13h7v6H4v-6Zm9 0h7v6h-7v-6Z"/></svg>
              <span>Categorias</span>
            </a>
            <a routerLink="/admin/produtos" routerLinkActive="active">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 2.3L6.2 8.5 12 11.7l5.8-3.2L12 5.3Zm-6 4.9v5.1l5 2.8V13l-5-2.8Zm7 7.9 5-2.8v-5.1L13 13v5.1Z"/></svg>
              <span>Produtos</span>
            </a>
            <a routerLink="/admin/configuracoes" routerLinkActive="active">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 4c0-.6-.1-1.2-.2-1.8l2-1.6-2-3.4-2.4 1a9.4 9.4 0 0 0-3.1-1.8L15 2h-4l-.4 2.4a9.4 9.4 0 0 0-3.1 1.8l-2.4-1-2 3.4 2 1.6A9.8 9.8 0 0 0 5 12c0 .6.1 1.2.2 1.8l-2 1.6 2 3.4 2.4-1a9.4 9.4 0 0 0 3.1 1.8L11 22h4l.4-2.4a9.4 9.4 0 0 0 3.1-1.8l2.4 1 2-3.4-2-1.6c.1-.6.2-1.2.2-1.8Zm-9 6a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"/></svg>
              <span>Configurações</span>
            </a>
            <a routerLink="/admin/importar-exportar" routerLinkActive="active">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 15V6.8L8.4 9.4 7 8l5-5 5 5-1.4 1.4L13 6.8V15h-2Zm-6 6a2 2 0 0 1-2-2v-5h2v5h14v-5h2v5a2 2 0 0 1-2 2H5Z"/></svg>
              <span>Dados e backup</span>
            </a>
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
                <span class="admin-user-fallback" aria-hidden="true">{{ user.displayName?.charAt(0) || 'P' }}</span>
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
  constructor(
    readonly auth: AuthService,
    private readonly router: Router
  ) {}

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/admin/login']);
  }
}
