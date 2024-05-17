import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateAndGetProjectComponent } from '../src/app/Components/management/create-and-get-project/create-and-get-project.component';



export const routes: Routes = [
  {
    path: '',
    component: CreateAndGetProjectComponent
  }
  

];

@NgModule({
  declarations: [],
  imports: [
    
    CommonModule,
    CreateAndGetProjectComponent,
    RouterModule.forChild(routes),
    
  ]
})
export class ProjetoMainModule { }
