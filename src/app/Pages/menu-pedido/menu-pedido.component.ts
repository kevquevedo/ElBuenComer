import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { Producto } from 'src/app/clases/producto';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductosService } from 'src/app/services/productos.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

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
  mesaUsuario! : number;
  idMesa! : string;
  usuarioLogueado! : any;
  valorTotal! : any;

  constructor(
    private prodServ: ProductosService,
    private pushServ: PushNotificationService,
    private mesaServ: MesaService,
    private userServ: UsuariosService,
    private auth: Auth,
    private pedidosServ: PedidosService,
    private toastController: ToastController,
  ) {
    this.spin = true;
    this.listadoMensajes = [];
    this.existenMensajes = false;
    this.idMesa = '';
    this.valorTotal = 0;
  }

  ngOnInit() {

    this.userServ.getListadoUsuarios().then( resp =>{
      resp.forEach( (item:any) => {
        if(item.data().email == this.auth.currentUser?.email){
          this.mesaUsuario = item.data().mesa.numero;
          this.usuarioLogueado = item.data();
          this.actualizarChat(this.mesaUsuario);
        }
      })
    })

    this.mesaServ.obtenerChatsMesas().then( resp =>{
      resp.forEach( (mesaChat:any) => {
        if(mesaChat.data().numero == this.mesaUsuario){
          this.idMesa = mesaChat.data().id;
        }
      })
    })

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
    this.calcularTotal();
  }

  restarProducto(productoBebida:any){
    if(productoBebida.cantidad > 0){
      productoBebida.cantidad--;
    }
    this.calcularTotal();
  }


  calcularTotal(){
    this.valorTotal = 0;
    this.listadoCocina.forEach( (item:any) => {
      if(item.cantidad > 0){
        this.valorTotal += (item.producto.precio * item.cantidad);
      }
    });
    this.listadoBebida.forEach( (item:any) => {
      if(item.cantidad > 0){
        this.valorTotal += (item.producto.precio * item.cantidad);
      }
    });
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
    let pedido = { productos: this.productosElegidos, usuario: this.usuarioLogueado, valorTotal: this.valorTotal, estado: 'pendiente' }
    this.pedidosServ.crearPedido(pedido)
  }

  enviarMensaje(){

    if (this.mensaje != "" && this.mensaje != null){

      let mensajeEnviado = {mensaje: this.mensaje, emisor: 'cliente', mesa: '1'};
      this.listadoMensajes.push(mensajeEnviado);
      this.mesaServ.updateChatsMesas(this.listadoMensajes, this.idMesa);
      //PUSH
      this.mensaje = "";
    }else{
     // this.presentToast('top', 'Se procesó correctamente la imagen.', 'success')
    }
    setTimeout( ()=>{ this.actualizarChat(this.mesaUsuario); }, 1000)

  }

  actualizarChat(numerMesa:number){
    this.mesaServ.obtenerChatsMesas().then( resp =>{
      resp.forEach( (mesaChat:any) => {
        if(mesaChat.data().numero == numerMesa){
          this.listadoMensajes = mesaChat.data().mensajes;
        }
      })
      console.log(this.listadoMensajes)
    })
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
