import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/user/login'; // Замените на реальный API

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    // Имитация запроса (для теста)
    return of({ success: true, login: true }).pipe(
      tap((res) => {
        if (res.success && res.login === true) {
          this.router.navigate(['/products']);
        }
      })
    );
  }
}
