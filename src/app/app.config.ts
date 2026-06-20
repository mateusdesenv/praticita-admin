import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { ApiMenuRepository } from './core/repositories/api-menu.repository';
import { LocalStorageMenuRepository } from './core/repositories/local-storage-menu.repository';
import { MENU_REPOSITORY } from './core/repositories/menu.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    {
      provide: MENU_REPOSITORY,
      useClass: environment.persistenceMode === 'api'
        ? ApiMenuRepository
        : LocalStorageMenuRepository
    }
  ]
};
