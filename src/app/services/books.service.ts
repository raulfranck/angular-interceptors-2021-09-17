import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AlertService, DialogData } from './alert.service';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';

export interface Book {
  id: number;
  title: string;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private loader: LoaderService,
    private router: Router,
    private alert: AlertService
    ) { }

  getAllBooks(): Observable<Book[]> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();

    return this.http.get<Book[]>(`${this.baseUrl}/books`, { headers }).pipe(
      catchError((error) => this.handleError(error)),
    );
  }

  getBookById(bookId: number): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();

    return this.http.get<Book>(`${this.baseUrl}/books/${bookId}`, { headers }).pipe(
      catchError((error) => this.handleError(error)),
    );
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();

    return this.http.post<Book>(`${this.baseUrl}/books`, book, { headers }).pipe(
      catchError((error) => this.handleError(error)),
    );
  }

  updateBook(book: Book): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();

    return this.http.put<Book>(`${this.baseUrl}/books/${book.id}`, book, { headers }).pipe(
      catchError((error) => this.handleError(error)),
    );
  }

  deleteBookById(bookId: number): Observable<Book> {
    const headers = this.getAuthorizationHeader();
    this.loader.startLoading();

    return this.http.delete<Book>(`${this.baseUrl}/books/${bookId}`, { headers }).pipe(
      catchError((error) => this.handleError(error)),
    );
  }

  private getAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders({Authorization: `Bearer ${this.auth.getAccessToken()}`})
  }

  private handleError(error: HttpErrorResponse) {
    if(error.status === 401) {
      const dialogData: DialogData = {
        status: error.status,
        statusText: error.statusText,
        message: "You need to authenticate first"
      }
      this.alert.showError(dialogData).subscribe(() => this.router.navigate(['login']))
    }

    return throwError(error)
  }
}
