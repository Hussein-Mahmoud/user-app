import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserResponse } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiKey = 'reqres-free-v1';
  private readonly api = 'https://reqres.in/api/users';
  private get httpOptions() {
    return {
      headers: new HttpHeaders({ 'x-api-key': this.apiKey }),
    };
  }

  constructor(private http: HttpClient) {}

  getUsers(page = 1, per_page = 10) {
    return this.http.get<UserResponse>(
      `${this.api}?page=${page}&per_page=${per_page}`,
      this.httpOptions
    );
  }

  getUser(id: number) {
    return this.http.get<{ data: User }>(`${this.api}/${id}`, this.httpOptions);
  }

  createUser(user: Partial<User>) {
    return this.http.post(`${this.api}`, user, this.httpOptions);
  }

  updateUser(id: number, user: Partial<User>) {
    return this.http.put(`${this.api}/${id}`, user, this.httpOptions);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.api}/${id}`, this.httpOptions);
  }
}
