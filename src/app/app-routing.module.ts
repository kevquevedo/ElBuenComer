import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaDuenoSupervisorComponent } from './Pages/alta-dueno-supervisor/alta-dueno-supervisor.component';
import { AltaEmpleadoComponent } from './Pages/alta-empleado/alta-empleado.component';
import { AltaProductosComponent } from './Pages/alta-productos/alta-productos.component';
import { AltaClientesComponent } from './Pages/alta-clientes/alta-clientes.component';
import { RegistrosPendientesComponent } from './Pages/registros-pendientes/registros-pendientes.component';
import { AltaMesaComponent } from './Pages/alta-mesa/alta-mesa.component';
import { EncuestaClienteComponent } from './Pages/encuesta-cliente/encuesta-cliente.component';
import { FlechasComponent } from './Pages/flechas/flechas.component';
import { MenuPedidoComponent } from './Pages/menu-pedido/menu-pedido.component';
import { PedidosComponent } from './Pages/pedidos/pedidos.component';
import { DetallePedidoComponent } from './Pages/detalle-pedido/detalle-pedido.component';
import { EstadoPedidoComponent } from './Pages/estado-pedido/estado-pedido.component';
import { ChatMozoComponent } from './Pages/chat-mozo/chat-mozo.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) },
  { path: 'splash', loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)},
  { path: 'alta-dueno-supervisor', component: AltaDuenoSupervisorComponent},
  { path: 'alta-empleado', component: AltaEmpleadoComponent},
  { path: 'alta-productos', component: AltaProductosComponent},
  { path: 'alta-clientes', component: AltaClientesComponent},
  { path: 'registros-pendientes', component: RegistrosPendientesComponent },
  { path: 'alta-mesa', component: AltaMesaComponent },
  { path: 'encuesta-clientes', component: EncuestaClienteComponent },
  { path: 'flechas', component: FlechasComponent },

  { path: 'pedidos', component: PedidosComponent },
  { path: 'detalle-pedido', component: DetallePedidoComponent },
  { path: 'menu-pedido', component: MenuPedidoComponent },
  { path: 'estado-pedido', component: EstadoPedidoComponent },
  { path: 'chat-mozo', component: ChatMozoComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
