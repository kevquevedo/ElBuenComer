import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { PrincipalComponent } from '../Pages/principal/principal.component';
import { AltaClientesComponent } from '../Pages/alta-clientes/alta-clientes.component';
import { AltaProductosComponent } from '../Pages/alta-productos/alta-productos.component';
import { ListaEsperaComponent } from '../Pages/lista-espera/lista-espera.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'principal',
    component: PrincipalComponent,
  },
  {
    path: 'listaEspera',
    component: ListaEsperaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
