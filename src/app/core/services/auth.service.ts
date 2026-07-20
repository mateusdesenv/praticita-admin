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
  user: { id: string; name: string; cpf: string; role: CollaboratorRole; permissions: Permissions };
}

const COLLABORATOR_SESSION_KEY = 'praticita_collaborator_session';
const allPermissions = (): Permissions => Object.fromEntries(
  ['dashboard', 'categories', 'products', 'collaborators', 'settings', 'backup']
    .map((screen) => [screen, { read: true, write: true }])
) as Permissions;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly app: FirebaseApp = initializeApp(environment.firebase);
  private readonly auth: Auth = getAuth(this.app);
  private readonly currentUser = signal<AuthUser | null>(this.readCollaboratorUser());
  private readonly initialized = signal(false);

  readonly user = this.currentUser.asReadonly();
  readonly ready = this.initialized.asReadonly();

  private readonly authReady = new Promise<AuthUser | null>((resolve) => {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user: AuthUser = {
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Conta Google',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL,
          provider: 'google',
          role: 'admin',
          permissions: allPermissions()
        };
        const synced = await this.syncGoogleUser(firebaseUser.uid, user.displayName, user.email, user.photoURL);
        if (synced) {
          user.role = synced.role;
          user.permissions = synced.permissions;
        }
        this.currentUser.set(user);
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
    const credential = await signInWithPopup(this.auth, provider);
    localStorage.removeItem(COLLABORATOR_SESSION_KEY);
    const user: AuthUser = {
      id: credential.user.uid,
      displayName: credential.user.displayName || 'Conta Google',
      email: credential.user.email || '',
      photoURL: credential.user.photoURL,
      provider: 'google',
      role: 'admin',
      permissions: allPermissions()
    };
    const synced = await this.syncGoogleUser(
      credential.user.uid,
      user.displayName,
      user.email,
      user.photoURL
    );
    if (synced) {
      user.role = synced.role;
      user.permissions = synced.permissions;
    }
    this.currentUser.set(user);
    return user;
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
    return {
      id: session.user.id,
      displayName: session.user.name,
      email: this.formatCpf(session.user.cpf),
      photoURL: null,
      provider: 'collaborator',
      role: session.user.role,
      permissions: session.user.permissions
    };
  }

  private formatCpf(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  private async syncGoogleUser(firebaseUid: string, name: string, email: string, photoURL: string | null): Promise<{ role: CollaboratorRole; permissions: Permissions } | null> {
    try {
      const token = environment.apiAdminToken?.trim() || '';
      const response = await fetch(`${environment.apiBaseUrl.replace(/\/+$/, '')}/auth/google-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ firebaseUid, name, email, photoURL })
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }
}
