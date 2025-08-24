import { Routes } from '@angular/router';
import { UsersLayoutsComponent } from './users-layouts.component';

export const UsersRoutes: Routes = [
  {
    path: '',
    component: UsersLayoutsComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/users-list/users-list').then((m) => m.UsersList),
      },
      {
        path: 'view/:id',
        loadComponent: () => import('./pages/view-user/view-user').then((m) => m.ViewUser),
      },
      {
        path: 'add',
        loadComponent: () => import('./pages/edit-user/edit-user').then((m) => m.EditUser),
      },
      {
        path: 'edit/:userId',
        loadComponent: () => import('./pages/edit-user/edit-user').then((m) => m.EditUser),
      },
    ],
  },
];
