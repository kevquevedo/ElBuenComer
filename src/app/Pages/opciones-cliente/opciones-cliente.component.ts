import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PedidosService } from 'src/app/services/pedidos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-opciones-cliente',
  templateUrl: './opciones-cliente.component.html',
  styleUrls: ['./opciones-cliente.component.scss'],
})
export class OpcionesClienteComponent  implements OnInit {

  spin!: boolean;
  usuario: any;
  pedido: any;

  constructor(
    private router: Router,
    private pedidosService: PedidosService,
    private usuarioService: UsuariosService,
    private toastController: ToastController,
    private auth: Auth
  ) {
    this.spin = true;
  }

  ngOnInit() {

    this.usuarioService.getListadoUsuarios().then((resp: any) => {
      resp.forEach((item: any) => {
        if (item.data().email == this.auth.currentUser?.email) {
          this.usuario = item.data();
          this.pedidosService.obtenerPedidoPorIdUsuarioTiempoReal(this.usuario.id).subscribe((res) => {

            if(this.pedido != 'FINALIZADO'){
              this.pedido = res;
              console.log(this.pedido )
            }
            if(this.pedido == 'FINALIZADO'){
              this.pedido = res;
              this.router.navigate(['/home/principal']);
            }
          });
          setTimeout( ()=>{ this.spin = false; }, 2000)
        }
        this.spin = false;
      })
    })



  }

  irAJuego(){
    this.router.navigate(['flechas']);
  }

  irAEncuesta(){
    if(!(this.pedido as Object).hasOwnProperty('encuesta')){
      this.router.navigate(['encuesta-clientes']);
    }else{
      this.presentToast('bottom', 'El cliente ya realizó la encuesta.', "danger", 4000);
    }
  }

  irADetalle(){
    this.router.navigate(['detalle-pedido']);
  }

  irAEstadisticas(){
    this.router.navigateByUrl('graficos-encuestas')
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duration,
      position: position,
      color: color
    });
    await toast.present();
  }
}
