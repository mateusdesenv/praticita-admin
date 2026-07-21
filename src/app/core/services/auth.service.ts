import { Injectable, signal } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { environment } from '../../../environments/environment';
import type { CollaboratorRole, Permissions, PermissionScreen } from './collaborators.service';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: 'google' | 'collaborator';
  role: CollaboratorRole;
  permissions: Permissions;
}

interface CollaboratorSession {
  token: string;
  expiresAt: string;
  user: { id: string; name: string; cpf: string | null; email: string | null; photoURL: string | null; provider: 'cpf' | 'google'; role: CollaboratorRole; permissions: Permissions };
}

export class GoogleAccessPendingError extends Error {
  constructor(readonly email: string) {
    super('Seu acesso está aguardando liberação do administrador.');
    this.name = 'GoogleAccessPendingError';
  }
}

const COLLABORATOR_SESSION_KEY = 'praticita_collaborator_session';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly app: FirebaseApp = initializeApp(environment.firebase);
  private readonly auth: Auth = getAuth(this.app);
  private readonly currentUser = signal<AuthUser | null>(this.readCollaboratorUser());
  private readonly initialized = signal(false);
  private interactiveGoogleSignIn = false;

  readonly user = this.currentUser.asReadonly();
  readonly ready = this.initialized.asReadonly();

  private readonly authReady = new Promise<AuthUser | null>((resolve) => {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!this.interactiveGoogleSignIn) {
          try { this.currentUser.set(await this.authorizeGoogleUser(firebaseUser)); }
          catch { await signOut(this.auth); this.currentUser.set(null); }
        }
      } else {
        this.currentUser.set(this.readCollaboratorUser());
      }
      this.initialized.set(true);
      resolve(this.currentUser());
    });
  });

  async waitUntilReady(): Promise<AuthUser | null> {
    return this.initialized() ? this.currentUser() : this.authReady;
  }

  async signInWithGoogle(): Promise<AuthUser> {
    await setPersistence(this.auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    this.interactiveGoogleSignIn = true;
    let credential;
    try { credential = await signInWithPopup(this.auth, provider); }
    finally { this.interactiveGoogleSignIn = false; }
    localStorage.removeItem(COLLABORATOR_SESSION_KEY);
    try {
      const user = await this.authorizeGoogleUser(credential.user);
      this.currentUser.set(user);
      return user;
    } catch (error) {
      await signOut(this.auth);
      this.currentUser.set(null);
      throw error;
    }
  }

  async signInWithCpf(cpf: string, password: string): Promise<AuthUser> {
    const response = await fetch(`${environment.apiBaseUrl.replace(/\/+$/, '')}/auth/collaborator/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, password })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || 'CPF ou senha inválidos.');
    }
    const session = await response.json() as CollaboratorSession;
    localStorage.setItem(COLLABORATOR_SESSION_KEY, JSON.stringify(session));
    const user = this.mapCollaborator(session);
    this.currentUser.set(user);
    return user;
  }

  getAccessToken(): string {
    const session = this.readSession();
    return session?.token || environment.apiAdminToken?.trim() || '';
  }

  canRead(screen: PermissionScreen): boolean {
    return this.currentUser()?.permissions?.[screen]?.read ?? false;
  }

  canWrite(screen: PermissionScreen): boolean {
    return this.currentUser()?.permissions?.[screen]?.write ?? false;
  }

  async signOut(): Promise<void> {
    const token = this.readSession()?.token;
    localStorage.removeItem(COLLABORATOR_SESSION_KEY);
    this.currentUser.set(null);
    if (this.auth.currentUser) await signOut(this.auth);
    if (token) {
      void fetch(`${environment.apiBaseUrl.replace(/\/+$/, '')}/auth/collaborator/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  }

  private readSession(): CollaboratorSession | null {
    try {
      const value = localStorage.getItem(COLLABORATOR_SESSION_KEY);
      if (!value) return null;
      const session = JSON.parse(value) as CollaboratorSession;
      if (!session.token || new Date(session.expiresAt).getTime() <= Date.now()) {
        localStorage.removeItem(COLLABORATOR_SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem(COLLABORATOR_SESSION_KEY);
      return null;
    }
  }

  private readCollaboratorUser(): AuthUser | null {
    const session = this.readSession();
    return session ? this.mapCollaborator(session) : null;
  }

  private mapCollaborator(session: CollaboratorSession): AuthUser {
    const permissions = structuredClone(session.user.permissions);
    // Sessões criadas antes do módulo Operação não possuem esta chave.
    // Aplicamos o preset correspondente ao papel sem obrigar a pessoa a sair e entrar novamente.
    if (!permissions.operations) {
      permissions.operations = session.user.role === 'admin' || session.user.role === 'cozinheiro'
        ? { read: true, write: true }
        : session.user.role === 'financeiro'
          ? { read: true, write: false }
          : { read: false, write: false };
    }
    return {
      id: session.user.id,
      displayName: session.user.name,
      email: session.user.provider === 'google' ? (session.user.email || '') : this.formatCpf(session.user.cpf || ''),
      photoURL: session.user.photoURL,
      provider: session.user.provider === 'google' ? 'google' : 'collaborator',
      role: session.user.role,
      permissions
    };
  }

  private formatCpf(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  private async authorizeGoogleUser(firebaseUser: import('firebase/auth').User): Promise<AuthUser> {
    const response = await fetch(`${environment.apiBaseUrl.replace(/\/+$/, '')}/auth/google`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: await firebaseUser.getIdToken() })
    });
    const body = await response.json().catch(() => null);
    if (response.status === 403 && body?.error === 'GOOGLE_ACCESS_PENDING') {
      throw new GoogleAccessPendingError(firebaseUser.email || '');
    }
    if (!response.ok) throw new Error(body?.message || 'Não foi possível validar seu acesso Google.');
    const session = body as CollaboratorSession;
    localStorage.setItem(COLLABORATOR_SESSION_KEY, JSON.stringify(session));
    return this.mapCollaborator(session);
  }
}
