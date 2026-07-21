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
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { PendingAccessPageComponent } from './features/auth/pages/pending-access-page/pending-access-page.component';
import { CollaboratorsPageComponent } from './features/admin/pages/collaborators-page/collaborators-page.component';
import { FinancePageComponent } from './features/admin/pages/finance-page/finance-page.component';
import { OperationsPageComponent } from './features/admin/pages/operations-page/operations-page.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: PublicMenuPageComponent },
  { path: 'produto/:slug', component: ProductDetailPageComponent },
  { path: 'admin/login', component: LoginPageComponent, canActivate: [guestGuard] },
  { path: 'admin/aguardando-liberacao', component: PendingAccessPageComponent, canActivate: [guestGuard] },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardPageComponent, canActivate: [authGuard], data: { permission: 'dashboard' } },
      { path: 'operacao', redirectTo: 'operacao/pedidos', pathMatch: 'full' },
      { path: 'operacao/pedidos', component: OperationsPageComponent, canActivate: [authGuard], data: { permission: 'operations', operationsView: 'orders' } },
      { path: 'operacao/agenda', component: OperationsPageComponent, canActivate: [authGuard], data: { permission: 'operations', operationsView: 'schedule' } },
      { path: 'operacao/producao', component: OperationsPageComponent, canActivate: [authGuard], data: { permission: 'operations', operationsView: 'production' } },
      { path: 'operacao/clientes', component: OperationsPageComponent, canActivate: [authGuard], data: { permission: 'operations', operationsView: 'customers' } },
      { path: 'categorias', component: CategoriesPageComponent, canActivate: [authGuard], data: { permission: 'categories' } },
      { path: 'produtos', component: ProductsPageComponent, canActivate: [authGuard], data: { permission: 'products' } },
      { path: 'produtos/novo', component: ProductFormPageComponent, canActivate: [authGuard], data: { permission: 'products' } },
      { path: 'produtos/:id', component: ProductFormPageComponent, canActivate: [authGuard], data: { permission: 'products' } },
      { path: 'financeiro', redirectTo: 'financeiro/contas-a-pagar', pathMatch: 'full' },
      { path: 'financeiro/contas-a-pagar', component: FinancePageComponent, canActivate: [authGuard], data: { permission: 'finance', financeType: 'payable' } },
      { path: 'financeiro/contas-a-receber', component: FinancePageComponent, canActivate: [authGuard], data: { permission: 'finance', financeType: 'receivable' } },
      { path: 'financeiro/notas-fiscais-entrada', component: FinancePageComponent, canActivate: [authGuard], data: { permission: 'finance', financeType: 'supplier_invoice' } },
      { path: 'colaboradores', component: CollaboratorsPageComponent, canActivate: [authGuard], data: { permission: 'collaborators' } },
      { path: 'configuracoes', component: BusinessSettingsPageComponent, canActivate: [authGuard], data: { permission: 'settings' } },
      { path: 'importar-exportar', component: ImportExportPageComponent, canActivate: [authGuard], data: { permission: 'backup' } }
    ]
  },
  { path: '**', redirectTo: '' }
];
