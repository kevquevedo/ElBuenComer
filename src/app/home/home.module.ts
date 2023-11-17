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
import { MenuPedidoComponent } from '../Pages/menu-pedido/menu-pedido.component';
import { EstadoPedidoComponent } from '../Pages/estado-pedido/estado-pedido.component';
import { ChatMozoComponent } from '../Pages/chat-mozo/chat-mozo.component';
import { FlechasComponent } from '../Pages/flechas/flechas.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  declarations: [
    HomePage,
    PrincipalComponent,
    MenuComponent,
    RegistrosPendientesComponent,
    ListaEsperaComponent,
    MenuPedidoComponent,
    EstadoPedidoComponent,
    ChatMozoComponent,
    FlechasComponent
  ]
})
export class HomePageModule {}
