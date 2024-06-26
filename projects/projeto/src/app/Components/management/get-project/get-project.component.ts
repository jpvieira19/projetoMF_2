import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Projeto } from '../../../Interfaces/IProjeto';
import { ProjetosService } from '../../../Services/projetos.service';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-get-project',
  templateUrl: './get-project.component.html',
  styleUrls: ['./get-project.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProjectDetailsComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class GetProjectComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'actions'];
  dataSource = new MatTableDataSource<Projeto>();
  selectedProject: Projeto | null = null;
  totalLength = 0;
  pageSize = 5;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private projectService: ProjetosService,
    private toastService: NgToastService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openCreateProject() {
    const dialogRef = this.dialog.open(CreateProjectComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
        this.totalLength = this.dataSource.data.length;
      }
    });
  }

  getAllProjects(): void {
    this.projectService.projects$.subscribe(projetos => {
      this.dataSource.data = projetos;
      this.totalLength = projetos.length;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  showProjectDetails(project: Projeto) {
    this.selectedProject = project;
  }
}
