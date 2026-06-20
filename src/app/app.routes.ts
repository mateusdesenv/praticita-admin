import { Routes } from '@angular/router';
import { PublicMenuPageComponent } from './features/public-menu/pages/menu-page/public-menu-page.component';
import { ProductDetailPageComponent } from './features/public-menu/pages/product-detail-page/product-detail-page.component';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout.component';
import { DashboardPageComponent } from './features/admin/pages/dashboard-page/dashboard-page.component';
import { CategoriesPageComponent } from './features/admin/pages/categories-page/categories-page.component';
import { ProductsPageComponent } from './features/admin/pages/products-page/products-page.component';
import { ProductFormPageComponent } from './features/admin/pages/product-form-page/product-form-page.component';
import { BusinessSettingsPageComponent } from './features/admin/pages/business-settings-page/business-settings-page.component';
import { ImportExportPageComponent } from './features/admin/pages/import-export-page/import-export-page.component';

export const routes: Routes = [
  { path: '', component: PublicMenuPageComponent },
  { path: 'produto/:slug', component: ProductDetailPageComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'categorias', component: CategoriesPageComponent },
      { path: 'produtos', component: ProductsPageComponent },
      { path: 'produtos/novo', component: ProductFormPageComponent },
      { path: 'produtos/:id', component: ProductFormPageComponent },
      { path: 'configuracoes', component: BusinessSettingsPageComponent },
      { path: 'importar-exportar', component: ImportExportPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
