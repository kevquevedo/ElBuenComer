import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaDuenoSupervisorComponent } from './Pages/alta-dueno-supervisor/alta-dueno-supervisor.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
<<<<<<< HEAD
  { path:'home',
  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  
=======
  { path:'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) },
  { path: 'splash', loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)},
  { path: 'alta-dueno-supervisor', component: AltaDuenoSupervisorComponent}
>>>>>>> origin/main
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
