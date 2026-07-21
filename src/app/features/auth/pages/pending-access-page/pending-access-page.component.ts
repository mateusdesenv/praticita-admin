import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pending-access-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="pending-access-page">
      <section class="pending-access-card" aria-labelledby="pending-title">
        <a class="admin-login-brand" routerLink="/" aria-label="Voltar ao cardápio da Praticità">
          <span><img src="/assets/praticita/logo.png" alt=""></span><strong>Praticità</strong>
        </a>
        <div class="pending-access-icon" aria-hidden="true">⏳</div>
        <span class="eyebrow">Acesso solicitado</span>
        <h1 id="pending-title">Aguardando liberação do administrador</h1>
        <p>Sua conta Google foi identificada, mas ainda não está cadastrada como administradora do painel.</p>
        @if (email) { <strong class="pending-access-email">{{ email }}</strong> }
        <p class="pending-access-help">Peça ao administrador para cadastrar este e-mail. Depois da liberação, volte e entre novamente com o Google.</p>
        <a class="button pending-access-action" routerLink="/admin/login">Voltar para o login</a>
        <a class="admin-login-back" routerLink="/">← Voltar ao cardápio</a>
      </section>
    </main>
  `
})
export class PendingAccessPageComponent {
  readonly email = this.route.snapshot.queryParamMap.get('email') || '';
  constructor(private readonly route: ActivatedRoute) {}
}
