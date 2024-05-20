import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IAssociation } from '../../../Interfaces/IAssociation';
import { Projeto } from '../../../Interfaces/IProjeto';
import { AssociationService } from '../../../Services/association.service';
import { ColaboratorService } from '../../../Services/colaborator.service';
import { IColaborator } from '../../../Interfaces/IColaborator';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProjectDetailsComponent implements OnInit, OnChanges {
  @Input() selectedProject: Projeto | null = null;
  associations: IAssociation[] = [];
  filteredAssociations: IAssociation[] = [];
  colaboradoresAssocLista: IColaborator[] = [];
  assocFilterOption: string = 'all';
  currentAssocPage = 1;
  assocPageSize = 5;
  totalAssocPages = 0;
  sortAssocColumn: keyof IAssociation = 'colaboratorId';
  sortAssocDirection: 'asc' | 'desc' = 'asc';
  message: string = '';
  isAddingAssociation = false;
  newAssociation: IAssociation = { id: 0, projectId: 0, colaboratorId: 0, startDate: '', endDate: '' };

  constructor(private associationService: AssociationService, private colaboradoresService: ColaboratorService) {}

  ngOnInit(): void {
    this.loadColaboradores();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProject'] && this.selectedProject) {
      this.assocFilterOption = 'all'; // Resetar o filtro ao mudar de projeto
      this.loadAssociations();
    }
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

  loadAssociations(): void {
    if (this.selectedProject) {
      this.associationService.getAssociationsByProjetoId(this.selectedProject.id).subscribe({
        next: (associations) => {
          this.associations = associations;
          this.applyAssocFilterOption(); // Aplicar o filtro ao carregar as associações
        },
        error: () => {
          this.message = 'Failed to fetch associations';
        }
      });
    }
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
          this.applyAssocFilterOption(); // Reaplicar o filtro ao adicionar nova associação
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
    const filteredWithinPeriod = this.associations.filter(association => {
      const now = new Date();
      switch (this.assocFilterOption) {
        case 'all':
          return true;
        case 'current':
          return new Date(association.startDate) <= now && new Date(association.endDate) >= now;
        case 'past':
          return new Date(association.endDate) < now;
        case 'future':
          return new Date(association.startDate) > now;
        default:
          return true;
      }
    });

    this.filteredAssociations = filteredWithinPeriod.filter(association =>
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
      case 'all':
        this.filteredAssociations = this.associations;
        break;
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
    this.applyAssocFilter(''); // Aplicar o filtro de texto após filtrar por período
    this.totalAssocPages = Math.ceil(this.filteredAssociations.length / this.assocPageSize);
    this.currentAssocPage = 1;
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

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return [day, month, year].join('/');
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
}
