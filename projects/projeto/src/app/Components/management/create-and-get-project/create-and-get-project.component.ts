import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Projeto } from '../../../Interfaces/IProjeto';
import { ProjetosService } from '../../../Services/projetos.service';
import { AssociationService } from '../../../Services/association.service';
import { ColaboratorService } from '../../../Services/colaborator.service';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IAssociation } from '../../../Interfaces/IAssociation';
import { IColaborator } from '../../../Interfaces/IColaborator';

@Component({
  selector: 'app-project',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './create-and-get-project.component.html',
  styleUrls: ['./create-and-get-project.component.css', './create-and-get-project.component.scss'],
  standalone: true,
})
export class CreateAndGetProjectComponent implements OnInit {
  projetos: Projeto[] = [];
  filteredProjetos: Projeto[] = [];
  projeto: Projeto = { id: 0, name: '', startDate: new Date(), endDate: new Date() };
  message: string = '';
  error = false;
  submitted = false;
  isCreating = false;
  selectedProject: Projeto | null = null;
  associations: IAssociation[] = [];
  filteredAssociations: IAssociation[] = [];
  colaboradoresAssocLista: IColaborator[] = [];
  isAddingAssociation = false;
  newAssociation: IAssociation = { id: 0, projectId: 0, colaboratorId: 0, startDate: '', endDate: '' };

  // Pagination and sorting for projects
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  sortColumn: keyof Projeto = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination and sorting for associations
  currentAssocPage = 1;
  assocPageSize = 5;
  totalAssocPages = 0;
  sortAssocColumn: keyof IAssociation = 'colaboratorId';
  sortAssocDirection: 'asc' | 'desc' = 'asc';

  // Filter option for associations
  assocFilterOption: string = 'current';

  constructor(
    private projectService: ProjetosService,
    private associationService: AssociationService,
    private colaboradoresService: ColaboratorService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.loadColaboradores();
  }

  openCreateProject() {
    this.isCreating = true;
  }

  closeCreateProject() {
    this.isCreating = false;
  }

  createProject(data: Projeto) {
    this.projectService.createProject(data).subscribe({
      next: (projeto) => {
        this.projeto = projeto;
        this.submitted = true;
        this.isCreating = false;
        this.getAllProjects();
      },
      error: () => {
        this.error = true;
        this.message = 'Failed to create the project';
      }
    });
  }

  getAllProjects(): void {
    this.projectService.projects$.subscribe(projetos => {
      this.projetos = projetos;
      this.filteredProjetos = projetos;
      this.totalPages = Math.ceil(this.filteredProjetos.length / this.pageSize);
      this.sortData(this.sortColumn);
    });
  }

  loadColaboradores(): void {
    this.colaboradoresService.getColabs().subscribe({
      next: (colaboradores) => {
        this.colaboradoresAssocLista = colaboradores;
      },
      error: () => {
        this.message = 'Failed to fetch colaboradores';
      }
    });
  }

  applyFilter(filterValue: string) {
    const lowerFilterValue = filterValue.trim().toLowerCase();
    this.filteredProjetos = this.projetos.filter(projeto =>
      projeto.name.toLowerCase().includes(lowerFilterValue) ||
      projeto.id.toString().includes(lowerFilterValue) ||
      this.formatDate(projeto.startDate).includes(lowerFilterValue) ||
      this.formatDate(projeto.endDate).includes(lowerFilterValue)
    );
    this.totalPages = Math.ceil(this.filteredProjetos.length / this.pageSize);
    this.currentPage = 1;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return [day, month, year].join('/');
  }

  sortData(column: keyof Projeto) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredProjetos.sort((a, b) => {
      let comparison = 0;
      if (a[column] > b[column]) {
        comparison = 1;
      } else if (a[column] < b[column]) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  paginatedData(): Projeto[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProjetos.slice(startIndex, startIndex + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  showProjectDetails(project: Projeto) {
    this.selectedProject = project;
    this.associationService.getAssociationsByProjetoId(project.id).subscribe({
      next: (associations) => {
        this.associations = associations;
        this.filteredAssociations = associations;
        this.totalAssocPages = Math.ceil(this.filteredAssociations.length / this.assocPageSize);
        this.applyAssocFilterOption();
      },
      error: () => {
        this.message = 'Failed to fetch associations';
      }
    });
  }

  openAddAssociation() {
    if (this.selectedProject) {
      this.newAssociation.projectId = this.selectedProject.id;
    }
    this.isAddingAssociation = true;
  }

  closeAddAssociation() {
    this.isAddingAssociation = false;
  }

  addAssociationToProject() {
    if (this.selectedProject) {
      this.associationService.addAssociation(this.newAssociation).subscribe({
        next: (newAssociation) => {
          this.associations.push(newAssociation);
          this.applyAssocFilterOption();
          this.totalAssocPages = Math.ceil(this.filteredAssociations.length / this.assocPageSize);
          this.isAddingAssociation = false;
        },
        error: () => {
          this.message = 'Failed to add association';
        }
      });
    }
  }

  applyAssocFilter(filterValue: string) {
    const lowerFilterValue = filterValue.trim().toLowerCase();
    this.filteredAssociations = this.associations.filter(association =>
      association.colaboratorId.toString().includes(lowerFilterValue) ||
      this.formatDate(new Date(association.startDate)).includes(lowerFilterValue) ||
      this.formatDate(new Date(association.endDate)).includes(lowerFilterValue)
    );
    this.totalAssocPages = Math.ceil(this.filteredAssociations.length / this.assocPageSize);
    this.currentAssocPage = 1;
  }

  applyAssocFilterOption() {
    const now = new Date();
    switch (this.assocFilterOption) {
      case 'current':
        this.filteredAssociations = this.associations.filter(association =>
          new Date(association.startDate) <= now && new Date(association.endDate) >= now
        );
        break;
      case 'past':
        this.filteredAssociations = this.associations.filter(association =>
          new Date(association.endDate) < now
        );
        break;
      case 'future':
        this.filteredAssociations = this.associations.filter(association =>
          new Date(association.startDate) > now
        );
        break;
    }
    this.applyAssocFilter('');
    this.totalAssocPages = Math.ceil(this.filteredAssociations.length / this.assocPageSize);
    this.currentAssocPage = 1;
  }

  sortAssocData(column: keyof IAssociation) {
    if (this.sortAssocColumn === column) {
      this.sortAssocDirection = this.sortAssocDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortAssocColumn = column;
      this.sortAssocDirection = 'asc';
    }

    this.filteredAssociations.sort((a, b) => {
      let comparison = 0;
      if (a[column] > b[column]) {
        comparison = 1;
      } else if (a[column] < b[column]) {
        comparison = -1;
      }
      return this.sortAssocDirection === 'asc' ? comparison : -comparison;
    });
  }

  paginatedAssocData(): IAssociation[] {
    const startIndex = (this.currentAssocPage - 1) * this.assocPageSize;
    return this.filteredAssociations.slice(startIndex, startIndex + this.assocPageSize);
  }

  previousAssocPage() {
    if (this.currentAssocPage > 1) {
      this.currentAssocPage--;
    }
  }

  nextAssocPage() {
    if (this.currentAssocPage < this.totalAssocPages) {
      this.currentAssocPage++;
    }
  }
}
