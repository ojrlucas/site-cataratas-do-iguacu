import { Routes } from '@angular/router';
import { adminGuard } from './core/guards';

const t = 'Parque Nacional do Iguaçu';
export const routes: Routes = [
  { path: '', title: `Cataratas do Iguaçu - ${t}`, loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'sobre', title: `Sobre - ${t}`, loadComponent: () => import('./pages/sobre/sobre').then((m) => m.Sobre) },
  { path: 'lazer', title: `Lazer - ${t}`, loadComponent: () => import('./pages/lazer/lazer').then((m) => m.Lazer) },
  { path: 'ingressos', title: `Ingressos - ${t}`, loadComponent: () => import('./pages/ingressos/ingressos').then((m) => m.Ingressos) },
  { path: 'admin', title: `Painel Administrativo - ${t}`, canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin) },
  { path: 'login', title: `Acessar Conta - ${t}`, data: { semLayout: true }, loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'registre-se', title: `Criar Conta - ${t}`, data: { semLayout: true }, loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro) },
  { path: '**', redirectTo: '' },
];
