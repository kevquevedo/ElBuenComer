import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AltaDuenoSupervisorComponent } from './Pages/alta-dueno-supervisor/alta-dueno-supervisor.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

import * as fire from 'firebase/app';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AltaEmpleadoComponent } from './Pages/alta-empleado/alta-empleado.component';
import { AltaProductosComponent } from './Pages/alta-productos/alta-productos.component';
import { AltaClientesComponent } from './Pages/alta-clientes/alta-clientes.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AltaMesaComponent } from './Pages/alta-mesa/alta-mesa.component';
import { ToastrModule } from 'ngx-toastr';
fire.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AltaDuenoSupervisorComponent,
    AppComponent,
    AltaEmpleadoComponent,
    AltaDuenoSupervisorComponent,
    AltaProductosComponent,
    AltaClientesComponent,
    AltaMesaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
