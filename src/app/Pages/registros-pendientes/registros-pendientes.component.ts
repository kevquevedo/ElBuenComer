import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { EnvioEmailService } from 'src/app/services/envio-email.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-registros-pendientes',
  templateUrl: './registros-pendientes.component.html',
  styleUrls: ['./registros-pendientes.component.scss'],
})
export class RegistrosPendientesComponent  implements OnInit {

  spin!: boolean;
  existenAprob!: boolean;
  listadoClientes! : any;

  constructor(
    private usuarioServ: UsuariosService,
    private emailServ: EnvioEmailService,
    private toastController: ToastController,
  ) {
    this.spin = true;
    this.existenAprob = false;
    this.listadoClientes = new Array<any>();
  }

  ngOnInit() {
    this.usuarioServ.getListadoUsuarios().then(resp => {
      this.listadoClientes=[];
      this.existenAprob = false;
      if (resp.size > 0) {
        resp.forEach((usuario: any) => {
          if (!usuario.data().clienteValidado && usuario.data().tipo == 'cliente' && usuario.data().tipoEmpleado == 'registrado') {
            this.existenAprob = true;
            this.listadoClientes.push(usuario.data())
          }
        });
        this.spin = false;
      }
    });
  }

  aceptarCliente(usuario:any){
    this.emailServ.enviarEmail(usuario.nombre + ' ' + usuario.apellido, usuario.email, 'Felicitaciones! La solicitud de alta de su usuario fue aprobada.');
    this.presentarToast('bottom', 'El mail se envió correctamente.', 'success')
    //CAMBIAR ESTADO DE USUARIO + ACTUALIZAR LISTADO DE PENDIENTES;
  }

  rechazarCliente(usuario:any){
    this.emailServ.enviarEmail(usuario.nombre + ' ' + usuario.apellido, usuario.email, 'Lo sentimos! La solicitud de alta de su usuario fue rechazada.');
    this.presentarToast('bottom', 'El mail se envió correctamente.', 'success');
    //CAMBIAR ESTADO DE USUARIO + ACTUALIZAR LISTADO DE PENDIENTES
  }

  async presentarToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
      color: color
    });
    await toast.present();
  }

}
