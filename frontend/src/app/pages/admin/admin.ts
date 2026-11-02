import { Component, signal } from '@angular/core';
import { AdminAtividades } from './abas/atividades/atividades';
import { AdminIngressos } from './abas/ingressos/ingressos';
import { AdminPedidos } from './abas/pedidos/pedidos';
import { AdminResumo } from './abas/resumo/resumo';
import { AdminUsuarios } from './abas/usuarios/usuarios';

type AbaId = 'resumo' | 'pedidos' | 'usuarios' | 'ingressos' | 'atividades';

interface Aba {
  id: AbaId;
  nome: string;
  icone: string;
}

@Component({
  selector: 'app-admin',
  imports: [AdminResumo, AdminPedidos, AdminUsuarios, AdminIngressos, AdminAtividades],
  templateUrl: './admin.html',
})
export class Admin {
  readonly abas: Aba[] = [
    { id: 'resumo', nome: 'Resumo', icone: 'bi-speedometer2' },
    { id: 'pedidos', nome: 'Pedidos', icone: 'bi-receipt' },
    { id: 'usuarios', nome: 'Usuários', icone: 'bi-people-fill' },
    { id: 'ingressos', nome: 'Ingressos', icone: 'bi-ticket-perforated-fill' },
    { id: 'atividades', nome: 'Lazer', icone: 'bi-tree-fill' },
  ];

  aba = signal<AbaId>('resumo');

  selecionar(id: AbaId) {
    this.aba.set(id);
  }
}
