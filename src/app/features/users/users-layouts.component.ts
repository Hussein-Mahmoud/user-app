import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersStore } from './store/user-store';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'article-layouts',
  standalone: true,
  imports: [RouterOutlet, Toast],
  providers: [UsersStore , MessageService],
  template: `<p-toast /><router-outlet />`,
})
export class UsersLayoutsComponent {}
