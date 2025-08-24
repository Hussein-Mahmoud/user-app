import { Component, inject, input, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { UsersStore } from '../../store/user-store';
import { User } from '../../../../core/interfaces/user';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule , RouterModule, ProgressSpinnerModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.scss',
})
export class EditUser {
  store = inject(UsersStore);
  route = inject(ActivatedRoute);
  userId = input<number>();
  ngOnInit(): void {
    const userId = this.userId();
    if (userId !== undefined) {
      this.store.getUserDetailsForEdit(userId);
    } else {
      this.store.resetuserToAddEdit();
    }
  }

  editUser() {
    const { first_name, last_name, email } = this.store.userToAddEdit().getRawValue();
    const payload: Partial<User> = { first_name, last_name, email };
    if (this.userId()) {
      this.store.updateUser({ id: this.userId()!, user: payload });
    } else {
      this.store.createUser(payload);
    }
  }
}
