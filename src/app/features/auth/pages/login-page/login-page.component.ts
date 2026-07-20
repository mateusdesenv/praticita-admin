import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="admin-login-page">
      <section class="admin-login-shell" aria-labelledby="login-title">
        <div class="admin-login-story">
          <a class="admin-login-brand" routerLink="/" aria-label="Voltar ao cardápio da Praticità">
            <span><img src="/assets/praticita/logo.png" alt=""></span>
            <strong>Praticità</strong>
          </a>

          <div class="admin-login-story-copy">
            <span class="admin-login-kicker">Central de gestão</span>
            <h1>Seu cardápio organizado em um só lugar.</h1>
            <p>Atualize produtos, categorias e informações do negócio com segurança e praticidade.</p>
          </div>

          <ul class="admin-login-benefits" aria-label="Recursos do painel">
            <li><span>01</span> Cardápio sempre atualizado</li>
            <li><span>02</span> Produtos e categorias organizados</li>
            <li><span>03</span> Acesso protegido pela sua conta Google</li>
          </ul>
        </div>

        <div class="admin-login-panel">
          <div class="admin-login-form">
            <span class="admin-login-lock" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9h14v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Zm2 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>
            </span>
            <span class="eyebrow">Área administrativa</span>
            <h2 id="login-title">Bem-vinda de volta</h2>
            <p>Entre com sua conta Google para acessar o painel da Praticità.</p>

            <button class="google-login-button" type="button" (click)="login()" [disabled]="loading()">
              @if (loading()) {
                <span class="google-login-spinner" aria-hidden="true"></span>
                <span>Conectando...</span>
              } @else {
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.32 2.98-7.39Z"/>
                  <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z"/>
                  <path fill="#FBBC05" d="M6.39 13.92A6 6 0 0 1 6.07 12c0-.67.11-1.32.32-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.53l3.35-2.61Z"/>
                  <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z"/>
                </svg>
                <span>Continuar com Google</span>
              }
            </button>

            @if (errorMessage()) {
              <p class="admin-login-error" role="alert">{{ errorMessage() }}</p>
            }

            <div class="admin-login-security">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 8 3v6c0 5-3.4 9.7-8 11-4.6-1.3-8-6-8-11V5l8-3Zm0 2.1L6 6.3V11c0 3.8 2.4 7.5 6 8.8 3.6-1.3 6-5 6-8.8V6.3l-6-2.2Zm-1 10.3-3-3 1.4-1.4 1.6 1.6 3.6-3.6 1.4 1.4-5 5Z"/></svg>
              <span>Autenticação segura fornecida pelo Google e Firebase.</span>
            </div>

            <a class="admin-login-back" routerLink="/">← Voltar ao cardápio</a>
          </div>
        </div>
      </section>
    </main>
  `
})
export class LoginPageComponent {
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  async login(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.auth.signInWithGoogle();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? returnUrl : '/admin');
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        this.errorMessage.set(
          code === 'auth/unauthorized-domain'
            ? 'Este domínio ainda não está autorizado no Firebase.'
            : 'Não foi possível entrar com o Google. Tente novamente.'
        );
      }
    } finally {
      this.loading.set(false);
    }
  }
}
