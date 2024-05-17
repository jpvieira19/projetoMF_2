import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IAssociation } from '../Interfaces/IAssociation';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  private urlGet = 'https://localhost:5041';
  private urlPost = 'https://localhost:5031';
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /** GET associations from the server */
  getAssociationsByProjetoId(projectId: number): Observable<IAssociation[]> {
    return this.httpClient
      .get<IAssociation[]>(this.urlGet + '/api/Association/ByProject/'+projectId)
      .pipe(catchError(this.handleError));
  }

  /** POST: add a new project to the server */
  addAssociation(IAssociation: IAssociation): Observable<IAssociation> {
    return this.httpClient.post<IAssociation>(this.urlPost + '/api/Association', IAssociation, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }



  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      console.log("error: " + error.message)
      return error;
    });
  }

}
