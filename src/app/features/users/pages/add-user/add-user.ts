import { Toast } from 'primeng/toast';
import { Component, effect, inject } from '@angular/core';
import { UsersStore } from '../../store/user-store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { User } from '../../../../core/interfaces/user';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, Toast, CardModule, ButtonModule, InputTextModule, RouterModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  store = inject(UsersStore);
  constructor() {
    this.store.resetuserToAddEdit();
  }
  createUser() {
    const { first_name, last_name, email } = this.store.userToAddEdit().getRawValue();
    const payload: Partial<User> = { first_name, last_name, email };
    this.store.createUser(payload);
  }
}
