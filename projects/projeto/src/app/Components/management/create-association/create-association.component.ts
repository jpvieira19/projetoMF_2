import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IAssociation } from '../../../Interfaces/IAssociation';
import { IColaborator } from '../../../Interfaces/IColaborator';
import { AssociationService } from '../../../Services/association.service';
import { Projeto } from '../../../Interfaces/IProjeto';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-create-association',
  templateUrl: './create-association.component.html',
  styleUrls: ['./create-association.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ]
})
export class CreateAssociationComponent {
  @Input() selectedProject: Projeto | null = null;
  @Input() colaboradoresAssocLista: IColaborator[] = [];
  @Output() close = new EventEmitter<void>();

  newAssociation: IAssociation = { id: 0, projectId: 0, colaboratorId: 0, startDate: '', endDate: '' };

  constructor(
    private associationService: AssociationService,
    private toastService: NgToastService,
    public dialogRef: MatDialogRef<CreateAssociationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedProject: Projeto, colaboradoresAssocLista: IColaborator[] }
  ) {}
  

  ngOnInit() {
    if (this.data) {
      this.selectedProject = this.data.selectedProject;
      this.colaboradoresAssocLista = this.data.colaboradoresAssocLista;
    }
  }

  addAssociationToProject() {
    if (this.selectedProject) {
      this.newAssociation.projectId = this.selectedProject.id;
      this.associationService.addAssociation(this.newAssociation).subscribe({
        next: (newAssociation) => {
          this.toastService.success({ detail: "Sucesso", summary: "Associação criada com sucesso", duration: 3000 });
          this.dialogRef.close(newAssociation);
        },
        error: () => {
          this.toastService.error({ detail: "Erro", summary: "Falha ao criar associação", duration: 3000 });
        }
      });
    }
  }
  

  closeCreateAssociation() {
    this.dialogRef.close();
  }
}
