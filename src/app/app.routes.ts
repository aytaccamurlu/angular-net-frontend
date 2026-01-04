import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register'; // 🔥 EKLE
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ProductsComponent } from './pages/products/product';
import { OrdersComponent } from './pages/orders/orders';
import { CustomersComponent } from './pages/customers/customers';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // 🔥 ŞART

  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'settings', component: SettingsComponent },

      // 🔴 BURADA DA HATA VAR (aşağıya bak)
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
