import { Component, inject } from '@angular/core';
import { UsersStore } from '../../store/user-store';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { UsersRowsPerPage } from '../../../../core/model/user.model';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-users-list',
  standalone:true,
  imports: [CommonModule, RouterModule, TableModule, PaginatorModule, ProgressSpinnerModule, ButtonModule, CardModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList {

  store = inject(UsersStore);
  readonly rowsPerPageOptions = UsersRowsPerPage;
  router = inject(Router);

  ngOnInit() {
  }

  onPageChange(event: any) {
    this.store.getUsers({ page: event.page + 1, per_page: event.rows });
  }

  goDetails(id: number) {
    this.router.navigate(['/users/view', id]);
  }
  goEdit(id: number) {
    this.router.navigate(['/users/edit', id]);
  }


}
