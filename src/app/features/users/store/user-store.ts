import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { signalStore, withState, withMethods, withHooks, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User, UserResponse } from '../../../core/interfaces/user';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

type AddEditUserFormModel = {
  email: FormControl<string>;
  first_name: FormControl<string>;
  last_name: FormControl<string>;
  id?: FormControl<string | null>;
};

type UsersState = {
  users: UserResponse;
  loading: boolean;
  loadingDetails: boolean;
  userDetails: User | null;
  error: string | null;
  showSuccessCreate: boolean;
  showSuccessEdit: boolean;
  userToAddEdit: FormGroup<AddEditUserFormModel>;
};
const initialUsersState: UsersState = {
  users: {
    page: 1,
    per_page: 10,
    total: 10,
    total_pages: 1,
    data: [],
  },
  loading: false,
  loadingDetails: false,
  userDetails: null,
  error: null,
  showSuccessCreate: false,
  showSuccessEdit: false,
  userToAddEdit: new FormGroup<AddEditUserFormModel>({
    first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  }),
};

export const UsersStore = signalStore(
  withState<UsersState>(initialUsersState),
  withMethods((store,
     userService = inject(UserService) ,
    router = inject(Router)) => {
    const getUsers = rxMethod<{ page: number; per_page: number }>((pipe) =>
      pipe.pipe(
        tap(() => {
          patchState(store, { loading: true, error: null });
        }),
        switchMap((params) =>
          userService.getUsers(params.page, params.per_page).pipe(
            finalize(() => {
              patchState(store, {
                loading: false,
              });
            }),
            tap((res) => {
              if (res) {
                patchState(store, {
                  users: res,
                });
              }
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message,
              });
              return of(null);
            })
          )
        )
      )
    );

    const getUserDetails = rxMethod<number>((pipe) =>
      pipe.pipe(
        tap(() => {
          patchState(store, {
            loadingDetails: true,
          });
        }),
        switchMap((id: number) =>
          userService.getUser(id).pipe(
            finalize(() => {
              patchState(store, {
                loadingDetails: false,
              });
            }),
            tap((res) => {
              if (res) {
                patchState(store, {
                  userDetails: res.data,
                });
              }
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message,
              });
              return of(null);
            })
          )
        )
      )
    );

    const getUserDetailsForEdit = rxMethod<number>((pipe) =>
      pipe.pipe(
        tap(() => {
          patchState(store, {
            loadingDetails: true,
          });
        }),
        switchMap((id: number) =>
          of(store.users().data.find((u) => u.id === id) ?? null).pipe(
            finalize(() => {
              patchState(store, {
                loadingDetails: false,
              });
            }),
            tap((user) => {
              if (user) {
                patchState(store, {
                  userDetails: user,
                });
                store
                  .userToAddEdit()
                  .setValue({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                  });
              } else {
                patchState(store, {
                  error: 'User not found in store',
                });
              }
            })
          )
        )
      )
    );

    const deleteUser = rxMethod<number>((pipe) =>
      pipe.pipe(
        tap(() => {
          patchState(store, {
            loading: true,
          });
        }),
        switchMap((id) =>
          userService.deleteUser(id).pipe(
            finalize(() => {
              patchState(store, {
                loading: false,
              });
            }),
            tap(() => {
              getUsers({ page: 1, per_page: store.users().per_page });
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message,
              });
              return of(null);
            })
          )
        )
      )
    );

    const createUser = rxMethod<Partial<User>>((pipe) =>
      pipe.pipe(
        tap(() => {
          patchState(store, {
            showSuccessCreate: false,
            loading: true,
          });
        }),
        switchMap((user) =>
          userService.createUser(user).pipe(
            finalize(() => {
              patchState(store, {
                loading: false,
              });
            }),
            tap((res) => {
              if (res) {
                patchState(store, {
                  showSuccessCreate: true,
                  users:{
                    ...store.users(),
                    data: [ res as User ,...store.users().data],
                  }
                });
                router.navigate(['/users']);
              }
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message,
              });
              return of(null);
            })
          )
        )
      )
    );

    const updateUser = rxMethod<{ id: number; user: Partial<User> }>((pipe) =>
      pipe.pipe(
        tap(() => {
          patchState(store, {
            showSuccessEdit: false,
            loading: true,
          });
        }),
        switchMap(({ id, user }) =>
          userService.updateUser(id, user).pipe(
            finalize(() => {
              patchState(store, {
                loading: false,
              });
            }),
            tap((res) => {
              if (res) {
                patchState(store, {
                  showSuccessEdit: true,
                });
                getUsers({ page: store.users().page, per_page: store.users().per_page });
                router.navigate(['/users']);
              }
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message,
              });
              return of(null);
            })
          )
        )
      )
    );

    const resetStore = () => {
      patchState(store, initialUsersState);
    };

    const resetuserToAddEdit = () => {
      patchState(store, {
        userToAddEdit: new FormGroup<AddEditUserFormModel>({
          first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          last_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
          }),
        }),
      });
    };

    const clearSuccessFlags = () => {
      patchState(store, {
        showSuccessCreate: false,
        showSuccessEdit: false,
      });
    };

    return {
      getUsers,
      getUserDetails,
      deleteUser,
      createUser,
      updateUser,
      getUserDetailsForEdit,
      resetStore,
      resetuserToAddEdit,
      clearSuccessFlags,
    };
  }),
  withHooks({
    onInit(store) {
      store.getUsers({ page: 1, per_page: 10 });
    },
    onDestroy() {},
  })
);
