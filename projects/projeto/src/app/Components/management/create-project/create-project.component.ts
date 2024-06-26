import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Projeto } from '../../../Interfaces/IProjeto';
import { ProjetosService } from '../../../Services/projetos.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class CreateProjectComponent implements OnInit {
  projeto: Projeto = { id: 0, name: '', startDate: new Date(), endDate: new Date() };

  constructor(
    private projectService: ProjetosService,
    private toastService: NgToastService,
    public dialogRef: MatDialogRef<CreateProjectComponent>
  ) {}

  ngOnInit(): void {}

  createProject() {
    this.projectService.createProject(this.projeto).subscribe({
      next: (projeto) => {
        this.toastService.success({ detail: "Sucesso", summary: "Projeto criado com sucesso", duration: 3000 });
        this.dialogRef.close(projeto);
      },
      error: () => {
        this.toastService.error({ detail: "Erro", summary: "Falha ao criar projeto", duration: 3000 });
      }
    });
  }

  closeCreateProject() {
    this.dialogRef.close();
  }
}
