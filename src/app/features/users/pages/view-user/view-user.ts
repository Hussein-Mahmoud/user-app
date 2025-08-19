import { Component, inject } from '@angular/core';
import { UsersStore } from '../../store/user-store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-view-user',
  standalone:true,
  imports: [ProgressSpinnerModule, CardModule, ButtonModule , RouterModule  ],
  templateUrl: './view-user.html',
  styleUrl: './view-user.scss'
})
export class ViewUser {
  store = inject(UsersStore);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.store.getUserDetails(Number(this.route.snapshot.params['id']));
  }

}
