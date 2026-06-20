import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="container topbar-inner">
          <a routerLink="/" class="brand-link" aria-label="Ir para o cardápio">
            <img src="/assets/praticita/logo.png" alt="Praticità Doces e Salgados">
            <span class="brand-title">
              <strong>Praticità</strong>
              <span>Doces e Salgados</span>
            </span>
          </a>

          <nav class="main-nav" aria-label="Navegação principal">
            <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Cardápio</a>
            <a class="nav-link" routerLink="/admin" routerLinkActive="active">Admin</a>
            <a class="button" href="https://wa.me/554999916511" target="_blank" rel="noopener">WhatsApp</a>
          </nav>
        </div>
      </header>

      <router-outlet />

      <footer class="footer">
        <div class="container footer-inner">
          <span>Praticità Doces e Salgados</span>
          <span>Rua Bulcão Viana, nº 1358 — Floresta</span>
          <span>49 9991-6511</span>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {}
