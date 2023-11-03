import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.scss'],
})
export class ListaEsperaComponent  implements OnInit {

  enListaEspera:any[] = [];
  mesasOcupadas:any[] = [];
  mesa:string = "1";
  spin!: boolean;

  constructor(private usuarioService:UsuariosService,private toastController: ToastController) {
    this.spin = true;
  }

  ngOnInit() {
   this.traerListaEspera();
  }

  traerListaEspera(){
    this.enListaEspera = [];
    this.mesasOcupadas = [];
    this.usuarioService.getListadoUsuarios().then(resp => {
      resp.forEach((usuario: any) => {
        if (usuario.data().enListaDeEspera == true) {
          this.enListaEspera.push(usuario.data());
          console.log(this.enListaEspera);
        }
        if(usuario.data().mesa != ""){
          this.mesasOcupadas.push(usuario.data().mesa);
          console.log(this.mesasOcupadas);
        }
      }
      )
      this.spin = false;
    }
    );
  }

  designarMesa(usuario:any){
    while(this.mesasOcupadas.includes(this.mesa)){
      this.mesa = (parseInt(this.mesa) + 1).toString();
    }
    this.presentarToast('middle', 'Mesa asignada correctamente', 'success');

    this.usuarioService.UpdateMesa(usuario.id, this.mesa);
    this.traerListaEspera();
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
