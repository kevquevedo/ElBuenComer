import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public usuarios: any = new Array<any>();

  loginUsuario: FormGroup;
  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder,
    private toastr: ToastrService, private router: Router, private usuarioService: UsuariosService) {
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    const email = this.loginUsuario.value.email;
    const pass = this.loginUsuario.value.pass;
    this.usuarioService.getListadoUsuarios().then(resp => {
      if (resp.size > 0) {
        let userFound = false;
        resp.forEach((usuario: any) => {
          if (usuario.data().email == email) {
            userFound = true;
            if (usuario.data().clienteValidado == true) {
              this.afAuth.signInWithEmailAndPassword(email, pass)
                .then((user) => {
                  this.afAuth.currentUser.then(user => {
                    const usuario = user?.email;
                  });
                  this.toastr.success("Bienvenido", "Ingreso correcto", { timeOut: 1000 });
                  this.router.navigate(['/home/principal']);
                }).catch((error) => {
                  this.toastr.error("Contraseña incorrecta", "Error", { timeOut: 1000 });
                });
            } else {
              this.toastr.error("Usuario no validado", "Error", { timeOut: 1000 });
            }
          }
        });

        if (!userFound) {
          this.toastr.error("Usuario no registrado", "Error", { timeOut: 1000 });
        }
      } else {
        this.toastr.error("Usuario no registrado", "Error", { timeOut: 1000 });
      }
    }).catch(error => {
      this.toastr.error("Ocurrió un error al obtener la lista de usuarios", "Error", { timeOut: 1000 });
    });
  }


  accesoRegistro() {
    this.router.navigate(['/home/registro']);
  }

  accesoRapidoUsuario() {
    this.loginUsuario.setValue({
      email: "macabf@hotmail.com",
      pass: "123456"
    });
    this.login();
  }

  accesoRapidoAdmin() {
    this.loginUsuario.setValue({
      email: "macarenaferrero@hotmail.com",
      pass: "123456"
    });
    this.login();
  }

  accesoRapidoInvitado() {
    this.loginUsuario.setValue({
      email: "macarenabetsabeferrero@gmail.com",
      pass: "123456"
    });
    this.login();
  }


}
