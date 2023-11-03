import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth:AngularFireAuth,
    ) { }

  async Register(email: string, password: string) {

    const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    // try {
    //   this.afAuth
    //     .createUserWithEmailAndPassword(email, password).then(result => {
    //       this.toastr.success('Registro satisfactorio.',"Success", {timeOut: 1000});
    //     });
    // } catch (error: any) {
    //   this.Errores(error);
    // }
  }

  // Errores(error: any) {
  //   if (error.code == 'auth/email-already-in-use') {
  //     this.toastr.error('El correo ya está en uso.',"Error", {timeOut: 1000});
  //   }
  //   else if (error.code == 'auth/missing-email' || error.code == 'auth/internal-error') {
  //     this.toastr.error('No pueden quedar campos vacíos.',"Error", {timeOut: 1000});
  //   }
  //   else if (error.code == 'auth/weak-password') {
  //     this.toastr.error('La contraseña debe tener al menos 8 caracteres',"Error", {timeOut: 1000});
  //   }
  //   else {
  //     this.toastr.error('Correo o contraseña invalidos.',"Error", {timeOut: 1000});
  //   }
  // }
}
