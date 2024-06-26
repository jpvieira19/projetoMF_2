import { Component, OnInit, ViewChild, OnChanges, Input, SimpleChanges } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { Projeto } from '../../../Interfaces/IProjeto';
import { AssociationService } from '../../../Services/association.service';
import { ColaboratorService } from '../../../Services/colaborator.service';
import { IAssociation } from '../../../Interfaces/IAssociation';
import { IColaborator } from '../../../Interfaces/IColaborator';
import { CreateAssociationComponent } from '../create-association/create-association.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    CreateAssociationComponent
  ]
})
export class ProjectDetailsComponent implements OnInit, OnChanges {
  @Input() selectedProject: Projeto | null = null;
  associations = new MatTableDataSource<IAssociation>();
  colaboradoresAssocLista: IColaborator[] = [];
  assocFilterOption: string = 'all';
  message: string = '';
  isAddingAssociation = false;

  displayedColumns: string[] = ['colaboratorId', 'startDate', 'endDate'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private associationService: AssociationService, private colaboradoresService: ColaboratorService) {}

  ngOnInit(): void {
    this.loadColaboradores();
    this.associations.sort = this.sort;
    this.associations.paginator = this.paginator;
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
          this.associations.data = associations;
          this.applyAssocFilterOption(); // Aplicar o filtro ao carregar as associações
        },
        error: () => {
          this.message = 'Failed to fetch associations';
        }
      });
    }
  }

  openAddAssociation() {
    this.isAddingAssociation = true;
  }

  closeAddAssociation() {
    this.isAddingAssociation = false;
  }

  applyAssocFilter(filterValue: string) {
    this.associations.filter = filterValue.trim().toLowerCase();
  }

  applyAssocFilterOption() {
    const now = new Date();
    this.associations.data = this.associations.data.filter(association => {
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
  }
}
