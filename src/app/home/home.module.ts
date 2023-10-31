import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';
import { RegistroComponent } from '../Pages/registro/registro.component';
import { PrincipalComponent } from '../Pages/principal/principal.component';
import { AltaClientesComponent } from '../Pages/alta-clientes/alta-clientes.component';
import { AltaProductosComponent } from '../Pages/alta-productos/alta-productos.component';
import { MenuComponent } from '../Shared/menu/menu.component';
import { RegistrosPendientesComponent } from '../Pages/registros-pendientes/registros-pendientes.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    
  ],
  declarations: [HomePage, RegistroComponent, PrincipalComponent, MenuComponent, RegistrosPendientesComponent]
})
export class HomePageModule {}
