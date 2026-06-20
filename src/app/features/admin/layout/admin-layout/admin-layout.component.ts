import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <main class="page">
      <div class="container admin-layout">
        <aside class="admin-sidebar">
          <h2>Admin Praticità</h2>
          <nav>
            <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
            <a routerLink="/admin/categorias" routerLinkActive="active">Categorias</a>
            <a routerLink="/admin/produtos" routerLinkActive="active">Produtos</a>
            <a routerLink="/admin/configuracoes" routerLinkActive="active">Configurações</a>
            <a routerLink="/admin/importar-exportar" routerLinkActive="active">Importar/Exportar</a>
            <a routerLink="/">Ver cardápio público</a>
          </nav>
        </aside>

        <section class="admin-content">
          <router-outlet />
        </section>
      </div>
    </main>
  `
})
export class AdminLayoutComponent {}
