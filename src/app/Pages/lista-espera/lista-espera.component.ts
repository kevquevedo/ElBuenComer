import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MesaService } from 'src/app/services/mesa.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.scss'],
})
export class ListaEsperaComponent  implements OnInit {

  enListaEspera:any[] = [];
  mesas:any[] = [];
  spin!: boolean;
  mesaSeleccionada: any;
  existenPendientes: boolean = false;

  constructor(private usuarioService:UsuariosService,private toastController: ToastController, private mesaService:MesaService) {
    this.spin = true;
  }

  ngOnInit() {
   this.traerListaEspera();
   this.getMesas();
  }

  traerListaEspera(){
    this.enListaEspera = [];
    this.existenPendientes = false;
    this.usuarioService.getListadoUsuarios().then(resp => {
      resp.forEach((usuario: any) => {
        if (usuario.data().enListaDeEspera == true) {
          this.existenPendientes = true;
          this.enListaEspera.push(usuario.data());
          console.log(this.enListaEspera);
        }
      }
      )
      this.spin = false;
    }
    );
  }

  getMesas() {
    this.mesaService.obtenerTodosLosMesas().then((data: any) => {
      this.mesas = [];
      for (let item of data) {
        if (!item.ocupada) {
          this.mesas.push(item);
        }
      }
      this.mesas.sort(this.ordenarPorNumero)
    });
  }

  ordenarPorNumero(mesa1: any, mesa2: any){
    if(mesa1.numero < mesa2.numero){
      return -1;
    }else if(mesa1.numero > mesa2.numero){
      return 1;
    }
    return 0;
  }

  getMesaSeleccionada(numero:any){
    this.mesas.forEach(mesa => {
      if(mesa.numero == numero){
        this.mesaSeleccionada = mesa;
      }
    });
  }

  asignarMesa(cliente: any, mesa: any){
    console.log(cliente.id + " cliente ");
    console.log(mesa.detail.value + " mesa");
    debugger;
    this.getMesaSeleccionada(mesa.detail.value);
    this.usuarioService.UpdateMesaCliente(cliente.id, this.mesaSeleccionada);
    this.presentarToast('bottom', 'Mesa asignada con exito', 'success');
    this.traerListaEspera();
    this.getMesas();
  }


  async presentarToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: position,
      color: color
    });
    await toast.present();
  }
}
