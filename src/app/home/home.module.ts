import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';
import { PrincipalComponent } from '../Pages/principal/principal.component';
import { MenuComponent } from '../Shared/menu/menu.component';
import { RegistrosPendientesComponent } from '../Pages/registros-pendientes/registros-pendientes.component';
import { ListaEsperaComponent } from '../Pages/lista-espera/lista-espera.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  declarations: [HomePage, PrincipalComponent, MenuComponent, RegistrosPendientesComponent, ListaEsperaComponent]
})
export class HomePageModule {}
