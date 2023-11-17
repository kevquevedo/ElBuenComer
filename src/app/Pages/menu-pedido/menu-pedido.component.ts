import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { eEstadoPedido, eEstadoProductoPedido } from 'src/app/clases/pedido';
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
  modalCarritoAbierto! : boolean;
  modalChatAbierto! : boolean;
  tiempoEstimado! : any;
  listadoMozos!: any;

  constructor(
    private prodServ: ProductosService,
    private pushServ: PushNotificationService,
    private mesaServ: MesaService,
    private userServ: UsuariosService,
    private auth: Auth,
    private pedidosServ: PedidosService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.spin = true;
    this.listadoMensajes = [];
    this.existenMensajes = false;
    this.idMesa = '';
    this.valorTotal = 0;
    this.modalCarritoAbierto = false;
    this.modalChatAbierto = false;
    this.productosElegidos = [];
    this.tiempoEstimado = 0;
  }

  ngOnInit() {

    this.userServ.getListadoUsuarios().then( resp =>{

      this.listadoMozos = [];
      resp.forEach( (item:any) => {

        if(item.data().email == this.auth.currentUser?.email){
          this.mesaUsuario = item.data().mesa.numero;
          this.usuarioLogueado = item.data();
          this.actualizarChat(this.mesaUsuario);
        }

        if(item.data().tipoEmpleado == 'mozo'){
          this.listadoMozos.push(item.data())
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
    this.calcularTiempoEstimado();
  }

  restarProducto(productoBebida:any){
    if(productoBebida.cantidad > 0){
      productoBebida.cantidad--;
    }
    this.calcularTotal();
    this.calcularTiempoEstimado();
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

  calcularTiempoEstimado(){
    this.tiempoEstimado = 0;
    this.listadoCocina.forEach( (item:any) => {
      if(item.producto.tiempo_elaboracion > this.tiempoEstimado){
        this.tiempoEstimado = item.producto.tiempo_elaboracion;
      }
    });
    this.listadoBebida.forEach( (item:any) => {
      if(item.producto.tiempo_elaboracion > this.tiempoEstimado){
        this.tiempoEstimado = item.producto.tiempo_elaboracion;
      }
    });
  }

  armarPedido(){
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
  }

  realizarPedido(){

// Mapear productosElegidos a productoPedido
  let productoPedidoList: any[] = this.productosElegidos.map((producto:any) => {
    return {
      cantidad: producto.cantidad,
      descripcion: producto.descripcion,
      id: producto.id,
      estado: eEstadoProductoPedido.PENDIENTE,
      img_src: producto.img_src[0],
      precio: producto.precio,
      nombre: producto.nombre,
      sector: producto.sector,
      tiempo_elaboracion: producto.tiempo_elaboracion
    };
  });

    let pedido = {
      productos: productoPedidoList,
      usuario: this.usuarioLogueado,
      valorTotal: this.valorTotal,
      estado: eEstadoPedido.PENDIENTE,
      num_mesa: this.mesaUsuario,
      tiempo_estimado: this.tiempoEstimado,
      decuento: 0,
      satisfaccion: 0,
      propina: 0,
      jugado: false
    }
    this.pedidosServ.crearPedido(pedido);
    this.presentarToast('bottom', `Se realizó el pedido con éxito.`, 'success');
    this.modalCarritoAbierto = false;
    this.spin = true;
    setTimeout( ()=>{
      this.spin = false;
      this.router.navigateByUrl('home/principal')
    }, 2000)
  }

  enviarMensaje(){

    if (this.mensaje != "" && this.mensaje != null){

      let mensajeEnviado = {mensaje: this.mensaje, emisor: 'cliente', mesa: '1'};
      this.listadoMensajes.push(mensajeEnviado);
      this.mesaServ.updateChatsMesas(this.listadoMensajes, this.idMesa);
      this.listadoMozos.forEach( (mozo:any) => {
        if(mozo.token != ''){
          console.log(mozo)
          this.pushServ.enviarPushNotification({
            registration_ids: [ mozo.token, ],
            notification: {
              title: 'Consulta - Mesa ' + this.mesaUsuario,
              body: 'Recibió una nueva consulta de un cliente.',
            },
            data: {
              ruta: 'chat-mozo',
            },
          }).subscribe( resp =>{
            console.log(resp)
          })

        }

      })

      this.mensaje = "";
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
    })
  }

  modalCarrito(abierto: boolean){
    this.modalCarritoAbierto = abierto;
    this.armarPedido();
  }

  modalChat(abierto: boolean){
    this.actualizarChat(this.mesaUsuario);
    this.modalChatAbierto = abierto;
  }

  async presentarToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: position,
      color: color
    });
    await toast.present();
  }


}

