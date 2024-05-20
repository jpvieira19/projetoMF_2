import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Projeto } from '../../../Interfaces/IProjeto';
import { ProjetosService } from '../../../Services/projetos.service';
import { ColaboratorService } from '../../../Services/colaborator.service';
import { ProjectDetailsComponent } from '../project-details/project-details.component';

@Component({
  selector: 'app-create-and-get-project',
  templateUrl: './create-and-get-project.component.html',
  styleUrls: ['./create-and-get-project.component.css', './create-and-get-project.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectDetailsComponent]
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

  // Pagination and sorting for projects
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  sortColumn: keyof Projeto = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private projectService: ProjetosService, private colaboradoresService: ColaboratorService) {}

  ngOnInit(): void {
    this.getAllProjects();
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
  }
}
