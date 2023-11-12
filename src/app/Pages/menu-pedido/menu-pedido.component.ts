import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/clases/producto';
import { MesaService } from 'src/app/services/mesa.service';
import { ProductosService } from 'src/app/services/productos.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-menu-pedido',
  templateUrl: './menu-pedido.component.html',
  styleUrls: ['./menu-pedido.component.scss'],
})
export class MenuPedidoComponent  implements OnInit {

  spin!: boolean;
  listadoCocina! :any;
  listadoBebida! :any;
  productosElegidos! :any;
  mensaje!: string;
  listadoMensajes! : any;
  numeroMesa! : any;
  existenMensajes! : boolean;

  constructor(
    private prodServ: ProductosService,
    private pushServ: PushNotificationService,
    private mesaServ: MesaService
  ) {
    this.spin = true;
    this.listadoMensajes = [];
    this.existenMensajes = false;
  }

  ngOnInit() {

    this.mesaServ.obtenerChatsMesas().then( resp => {

    });

    this.prodServ.obtenerTodosLosProductos().then( resp => {
      this.listadoCocina = [];
      this.listadoBebida = [];

      resp.forEach( (item:any) => {
        if(item.sector == 'cocina'){
          let objeto = { producto: item, cantidad: 0 };
          this.listadoCocina.push(objeto)
        }
        if(item.sector == 'bebida'){
          let objeto = { producto: item, cantidad: 0 };
          this.listadoBebida.push(objeto)
        }
      })
      setTimeout( ()=>{ this.spin = false; }, 500)
    });
  }

  sumarProducto(productoCocina:any){
    productoCocina.cantidad++;
  }

  restarProducto(productoBebida:any){
    if(productoBebida.cantidad > 0){
      productoBebida.cantidad--;
    }
  }

  realizarPedido(){
    this.productosElegidos = [];
    this.listadoCocina.forEach( (item:any) => {
      if(item.cantidad > 0){
        this.productosElegidos.push(item);
      }
    });
    this.listadoBebida.forEach( (item:any) => {
      if(item.cantidad > 0){
        this.productosElegidos.push(item);
      }
    });
    console.log(this.productosElegidos)
  }

  enviarMensaje(){

    if (this.mensaje != "" && this.mensaje != null){
      // this.chatService.enviarMensaje4A(this.mensaje, this.usuario);

      let mensajeEnviado = {mensaje: this.mensaje, emisor: 'cliente', mesa: '1'}
      this.listadoMensajes.push(mensajeEnviado)
      //PUSH
      this.mensaje = "";
    }else{
      //tal vez poner toast
    }
    //this.cargarMensajes();
  }

  obtenerHorario(): string {
    let date: Date = new Date();
    let fecha: string = date.getDate().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString()
      + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString();
    return fecha;
  }


}
