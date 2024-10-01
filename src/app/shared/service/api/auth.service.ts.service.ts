import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UserDTO } from '../../model/response/UserDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private access_token?: string;
  private refreshToken?: string;
  private apiBaseUrl = environment.urlBase; // Url base backend
  private username!: string;
  private password!: string;
  public buyerId!: number;

  constructor(private http: HttpClient, private router: Router) {
    const storedUsername = localStorage.getItem('username');
    const storedAccess_Token = localStorage.getItem('accessToken');

    if (storedUsername) {
      this.username = storedUsername;
    }
    if (storedAccess_Token) {
      this.access_token = storedAccess_Token;
    }
  }

  login(username: string, password: string): Observable<boolean> {
    this.username = username;
    this.password = password;

    return this.getAccessToken().pipe(
      map((token) => {
        if (token) {
          this.access_token = token;
          localStorage.setItem('username', this.username);
          localStorage.setItem('accessToken', this.access_token);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return of(false);
      })
    );
  }

  public logout(): void {
    const url = `${this.apiBaseUrl}check/logout?username=${encodeURIComponent(
      this.username
    )}&password=${encodeURIComponent(this.password)}`;
    this.http
      .get(url)
      .pipe(
        catchError((error) => {
          console.error('Error during logout:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        this.access_token = '';
        this.refreshToken = '';
        this.username = '';
        localStorage.removeItem('username');

        this.router.navigate(['/sign-in']);
      });
  }

  public adminCheck(): Observable<boolean> {
    const url = `${this.apiBaseUrl}check/logged/admin`;

    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<boolean>(url, { headers })),
      catchError((error) => {
        // Handle the error and return a safe value
        console.error('Error during admin check:', error);
        return of(false);
      })
    );
  }

  public customerCheck(): Observable<boolean> {
    const url = `${this.apiBaseUrl}check/logged/user`;

    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<boolean>(url, { headers })),
      catchError((error) => {
        // Handle the error and return a safe value
        console.error('Error during customer check:', error);
        return of(false);
      })
    );
  }

  private getAccessToken(): Observable<string | null> {
    const url = `${this.apiBaseUrl}check/getToken?username=${encodeURIComponent(
      this.username
    )}&password=${encodeURIComponent(this.password)}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((token) => {
        console.log('ACCESS_Token received:', token);
        if (token) {
          return token;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error getting access token:', error);
        return of(null);
      })
    );
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    if (this.access_token) {
      return of(
        new HttpHeaders({
          Authorization: `Bearer ${this.access_token}`,
        })
      );
    } else {
      console.error('No access token available');
      return of(new HttpHeaders());
    }
  }

  public getBuyerId(): Observable<number> {
    console.log(`Fetching user ID for username: ${this.username}`);

    if (!this.username) {
      this.username = localStorage.getItem('username') || '';
    }

    let queryParams = new HttpParams()
      .set('key_word', this.username)
      .set('state', 'customer');

    console.log(`Query parameters: ${queryParams.toString()}`);

    return this.http
      .get<UserDTO[]>(environment.urlBase + 'users/user', {
        params: queryParams,
      })
      .pipe(
        map((users: UserDTO[]) => {
          if (users && users.length > 0 && users[0].id) {
            console.log(`User ID found: ${users[0].id}`);
            return users[0].id;
          } else {
            console.error('User not found or ID missing');
            throw new Error('User not found or ID missing');
          }
        }),
        catchError((error) => {
          console.error('Error in getBuyerId:', error);
          return throwError(() => new Error('Failed to fetch user ID'));
        })
      );
  }


  
  GetPurchasesByUser(): Observable<any[]> { 
    return this.getBuyerId().pipe(
      switchMap(buyerId => {
        if (buyerId) {
          const body = { id: buyerId };
          return this.http.post<any[]>(
            `${environment.urlBase}purchases/purchase/getPurchases`, 
            body,
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
          );
        } else {
          return throwError(() => new Error('Buyer ID not found - Auth_Service'));
        }
      }),
      catchError((error) => {
        console.error('Error fetching purchases - in Auth_Service: ', error);
        return throwError(() => new Error('Failed to fetch purchases'));
      })
    );
  }


  GetCart(){
    const url = `${this.apiBaseUrl}carts/cart`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<any>(url, { headers })),
      catchError((error) => {
        // Handle the error and return a safe value
        console.error('Error during GetCart request:', error);
        return of(false);
      })
    );
  }

  AddToCart(themeID: number){
    const url = `${this.apiBaseUrl}carts/cart/add/${themeID}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.get<any>(url, { headers })),
      catchError((error) => {
        // Handle the error and return a safe value
        console.error('!!! Error ADDING TO CART !!!!    ---->>>     ', error);
        return of(false);
      })
    );

  }

  RemoveFromCart(themeID: number){
    const url = `${this.apiBaseUrl}carts/cart/remove/${themeID}`;
    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.delete<any>(url, { headers })),
      catchError((error) => {
        // Handle the error and return a safe value
        console.error('!!! Error REMOVING FROM CART !!!!  ---->>>   ', error);
        return of(false);
      })
    );
  }

  ClearCart(){
    const url = `${this.apiBaseUrl}carts/cart/clear`;

    return this.getAuthHeaders().pipe(
      switchMap((headers) => this.http.post<any>(url, { headers })),
      catchError((error) => {
        // Handle the error and return a safe value
        console.error('Error during cart clearing:', error);
        return of(false);
      })
    );

  }

  
}
