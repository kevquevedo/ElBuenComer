import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaDuenoSupervisorComponent } from './Pages/alta-dueno-supervisor/alta-dueno-supervisor.component';
import { AltaEmpleadoComponent } from './Pages/alta-empleado/alta-empleado.component';
import { AltaProductosComponent } from './Pages/alta-productos/alta-productos.component';
import { AltaClientesComponent } from './Pages/alta-clientes/alta-clientes.component';
import { RegistrosPendientesComponent } from './Pages/registros-pendientes/registros-pendientes.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path:'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) },
  { path: 'splash', loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)},
  { path: 'alta-dueno-supervisor', component: AltaDuenoSupervisorComponent},
  { path: 'alta-empleado', component: AltaEmpleadoComponent},
  { path: 'alta-productos', component: AltaProductosComponent},
  { path: 'alta-clientes', component: AltaClientesComponent},
  { path: 'registros-pendientes', component: RegistrosPendientesComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
