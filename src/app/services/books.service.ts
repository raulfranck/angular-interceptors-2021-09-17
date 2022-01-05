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
    return this.http.get<Book[]>(`${this.baseUrl}/books`)
  }

  getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${bookId}`)
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/books`, book)
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/books/${book.id}`, book)
  }

  deleteBookById(bookId: number): Observable<Book> {
      return this.http.delete<Book>(`${this.baseUrl}/books/${bookId}`)
  }
}
