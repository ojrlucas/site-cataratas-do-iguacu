import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

const TITULO_BASE = 'Parque Nacional do Iguaçu';
export const routes: Routes = [
  { path: '', title: `Cataratas do Iguaçu - ${TITULO_BASE}`, loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'sobre', title: `Sobre - ${TITULO_BASE}`, loadComponent: () => import('./pages/sobre/sobre').then((m) => m.Sobre) },
  { path: 'lazer', title: `Lazer - ${TITULO_BASE}`, loadComponent: () => import('./pages/lazer/lazer').then((m) => m.Lazer) },
  { path: 'ingressos', title: `Ingressos - ${TITULO_BASE}`, loadComponent: () => import('./pages/ingressos/ingressos').then((m) => m.Ingressos) },
  { path: 'admin', title: `Painel Administrativo - ${TITULO_BASE}`, canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin) },
  { path: 'login', title: `Acessar Conta - ${TITULO_BASE}`, data: { semLayout: true }, loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'registre-se', title: `Criar Conta - ${TITULO_BASE}`, data: { semLayout: true }, loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro) },
  { path: '**', redirectTo: '' },
];
