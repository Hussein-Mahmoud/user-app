import { Component, inject, signal } from '@angular/core';
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
  userId = signal<number>(0);
  ngOnInit(): void {
    this.userId.set(Number(this.route.snapshot.params['id']));
    this.store.getUserDetailsForEdit(this.userId());
  }

  editUser() {
    const { first_name, last_name, email } = this.store.userToAddEdit().getRawValue();
    const payload: Partial<User> = { first_name, last_name, email };
    this.store.updateUser({ id: this.userId(), user: payload });
  }
}
