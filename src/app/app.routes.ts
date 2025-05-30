import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProductsComponent } from './products/products.component';
import { SuppliesComponent } from './supplies/supplies.component';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'supplies',
    component: SuppliesComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
