import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Projeto } from '../Interfaces/IProjeto';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ProjetosService {

  private projetosURL = 'api/project';
  url = 'http://localhost:5186/';
  urlC = 'http://localhost:5188/';

  private projectsSubject = new BehaviorSubject<Projeto[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<Projeto[]>(this.url + this.projetosURL)
      .pipe(catchError(this.handleError))
      .subscribe(projetos => this.projectsSubject.next(projetos));
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /** GET heroes from the server */
  getProjeto(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.url + this.projetosURL).pipe(
      tap(projetos => this.projectsSubject.next(projetos)),catchError(this.handleError)
    );
  }

  createProject(project: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(this.urlC + this.projetosURL, project, this.httpOptions).pipe(tap(newProject => {
      // Atualiza o BehaviorSubject adicionando o novo projeto ao array existente
      const updatedProjects = [...this.projectsSubject.value, newProject];
      this.projectsSubject.next(updatedProjects);
    }),
      catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }




}
