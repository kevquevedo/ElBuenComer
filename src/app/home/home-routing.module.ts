import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { RegistroComponent } from '../Pages/registro/registro.component';
import { PrincipalComponent } from '../Pages/principal/principal.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
  {
    path: 'principal',
    component: PrincipalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
