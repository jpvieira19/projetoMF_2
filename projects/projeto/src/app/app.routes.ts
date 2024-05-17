import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
      {
        path: '',
        loadChildren: () => import('../../projeto-main/projeto-main.module').then((m) => m.ProjetoMainModule)
      },
      
];
