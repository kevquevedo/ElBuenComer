import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuariosService } from '../services/usuarios.service';
import { ToastController } from '@ionic/angular';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public usuarios: any = new Array<any>();

  loginUsuario: FormGroup;
  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router, private usuarioService: UsuariosService,
    private pushNotiSvc: NotificationService) {
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
            if (usuario.data().clienteValidado == 'aceptado') {
              this.afAuth.signInWithEmailAndPassword(email, pass)
                .then((user) => {
                  this.afAuth.currentUser.then(user => {
                    const usuario = user?.email;
                  });
                  console.log(usuario.data().id);
                  //this.pushNotiSvc.initializePushNotifications(usuario.data().id);
                  let userToken = localStorage.getItem('deviceToken'); 
                  if(userToken != null){
                    this.usuarioService.actualizarToken(usuario.data().id, JSON.parse(userToken));
                  }
                  this.presentToast('middle', 'Bienvenido. Ingreso correcto', 'success');
                  this.router.navigate(['/home/principal']);
                }).catch((error) => {
                  this.presentToast('middle', 'Contraseña incorrecta.', 'danger');
                });
            } else {
              this.presentToast('middle', 'Usuario no validado.', 'danger');
            }
          }
        });

        if (!userFound) {
          this.presentToast('middle', 'Usuario no registrado.', 'danger');
        }
      } else {
        this.presentToast('middle', 'Usuario no registrado.', 'danger');
      }
    }).catch(error => {
      this.presentToast('middle', 'Ocurrió un error al obtener la lista de usuarios.', 'danger');
    });
  }


  
  altaClientes(){
    this.router.navigate(['alta-clientes']);
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

  accesoRapidoCliente() {
    this.loginUsuario.setValue({
      email: "macabf@gmail.com",
      pass: "123456"
    });
    this.login();
  }

  accesoRapidoBartender() {
    this.loginUsuario.setValue({
      email: "maquitis1415@gmail.com",
      pass: "123456"
    });
    this.login();
  }

  accesoRapidoMetre() {
    this.loginUsuario.setValue({
      email: "macarenaf@gmail.com",
      pass: "123456"
    });
    this.login();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
      color: color
    });
    await toast.present();
  }

}
