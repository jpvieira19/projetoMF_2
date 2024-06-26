import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GetProjectComponent } from '../src/app/Components/management/get-project/get-project.component';



export const routes: Routes = [
  {
    path: '',
    component: GetProjectComponent
  }
  

];

@NgModule({
  declarations: [],
  imports: [
    
    CommonModule,
    GetProjectComponent,
    RouterModule.forChild(routes),
    
  ]
})
export class ProjetoMainModule { }
