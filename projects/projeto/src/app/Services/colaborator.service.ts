import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IColaborator } from '../Interfaces/IColaborator';

@Injectable({
  providedIn: 'root'
})
export class ColaboratorService {

  private urlGet = 'https://localhost:5011';
  private urlPost = 'https://localhost:5001';
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /** GET colabs from the server */
  getColabs(): Observable<IColaborator[]> {
    return this.httpClient
      .get<IColaborator[]>(this.urlGet + '/api/Colaborator')
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      console.log("error: " + error.message)
      return error;
    });
  }

}
