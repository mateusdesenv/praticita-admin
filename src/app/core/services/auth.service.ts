import { Injectable, signal } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly app: FirebaseApp = initializeApp(environment.firebase);
  private readonly auth: Auth = getAuth(this.app);
  private readonly currentUser = signal<User | null>(null);
  private readonly initialized = signal(false);

  readonly user = this.currentUser.asReadonly();
  readonly ready = this.initialized.asReadonly();

  private readonly authReady = new Promise<User | null>((resolve) => {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.initialized.set(true);
      resolve(user);
    });
  });

  async waitUntilReady(): Promise<User | null> {
    if (this.initialized()) {
      return this.currentUser();
    }

    return this.authReady;
  }

  async signInWithGoogle(): Promise<User> {
    await setPersistence(this.auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(this.auth, provider);
    return credential.user;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
