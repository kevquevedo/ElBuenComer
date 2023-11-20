import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { PedidosService } from 'src/app/services/pedidos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.component.html',
  styleUrls: ['./estado-pedido.component.scss'],
})
export class EstadoPedidoComponent  implements OnInit {

  spin!: boolean;
  numeroMesa!: any;
  pedido!: any;
  usuario!: any;

  constructor(
    private pedidosService: PedidosService,
    private usuarioService: UsuariosService,
    private auth: Auth
  ) {
    this.spin = true;
  }

  ngOnInit() {

    this.usuarioService.getListadoUsuarios().then( resp=>{
      resp.forEach( (item:any) =>{
        if(item.data().email == this.auth.currentUser?.email){
          this.numeroMesa = item.data().mesa.numero;
          this.usuario = item.data();
        }
      });

      this.pedidosService.obtenerPedidosEnTiempoReal().subscribe((pedidos: any) => {
        pedidos.forEach((item: any) => {
          if (this.numeroMesa == item.payload.doc.data().num_mesa) {
            this.pedido = item.payload.doc.data();
          }
        });

        setTimeout(() => { this.spin = false; }, 1000);
      });
    });

    

  }

}
