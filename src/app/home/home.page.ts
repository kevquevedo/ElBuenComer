import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loginUsuario:FormGroup;
  constructor(private afAuth:AngularFireAuth,private fb:FormBuilder,
    //  private toastr: ToastrService,
      private router: Router) {
    this.loginUsuario = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      pass: ['',[Validators.required, Validators.minLength(6)]],
    });
  }

  login(){
    const email = this.loginUsuario.value.email;
    const pass = this.loginUsuario.value.pass;
    this.afAuth.signInWithEmailAndPassword(email, pass)
    .then((user) => {
      // this.toastr.success("Ingreso satisfactorio", "Sesión iniciada", {timeOut: 1000});
      this.afAuth.currentUser.then(user=>{
        const usuario = user?.email
        console.log(usuario);
      })
      this.router.navigate(['/home/principal']);
    }).catch((error) => {
      // this.toastr.error("Usuario o contraseña incorrectos","Error", {timeOut: 1000});
    })
  }
  accesoRegistro(){
    this.router.navigate(['/home/registro']);
  }

  accesoRapidoAdmin(){
    this.loginUsuario.setValue({
      email: "admin@admin.com",
      pass:"111111"
    });
    this.login();
  }

  accesoRapidoUsuario(){
    this.loginUsuario.setValue({
      email: "usuario@usuario.com",
      pass:"333333"
    });
    this.login();
  }

  accesoRapidoInvitado(){
    this.loginUsuario.setValue({
      email: "invitado@invitado.com",
      pass:"222222"
    });
    this.login();
  }

}
