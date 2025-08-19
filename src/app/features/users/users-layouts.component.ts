import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersStore } from './store/user-store';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'article-layouts',
  standalone: true,
  imports: [RouterOutlet],
  providers: [UsersStore , MessageService],
  template: `<router-outlet />`,
})
export class UsersLayoutsComponent {}
