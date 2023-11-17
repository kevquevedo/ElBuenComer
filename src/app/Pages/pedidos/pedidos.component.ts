import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { PedidosService } from 'src/app/services/pedidos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent  implements OnInit {

  tipoSector:string='COCINA'; //Hacerlo funcional con la sesion 
  pedidos:any[]=[];
  prodPendientesElaboracion:number=0;
  esMetre= false;
  esCliente=false;
  esEmpleado=false;
  usuario:any;
  spin = true;
  pedidosConfirmados:any[]=[];

  
  constructor(private router:Router,
    private pedidosSrv:PedidosService ,
    //private authSrv:AuthService,
    //private msjSrv:MensajeService,
    //private fireSrv:FirestoreService,
    private auth: Auth,
    private userServ: UsuariosService
    ) { }

  ngOnInit() {
    this.pedidosSrv.obtenerTodosLosPedidos().then((res)=>{
      this.pedidos= res;
      this.pedidosConfirmados = this.pedidos.filter(pedido => pedido.estado !== 'PENDIENTE');
      console.log(this.pedidos);
    });


    this.userServ.getListadoUsuarios().then( resp =>{
      resp.forEach( (item:any) => {
        if(item.data().email == this.auth.currentUser?.email){
          // this.mesaUsuario = item.data().mesa.numero;
          this.usuario = item.data();
          //console.log(this.usuario);
          if(this.usuario.tipo =='cliente'){
            this.esCliente=true;
          }
          else if(this.usuario.tipo =='empleado'){
            if(this.usuario.tipoEmpleado=='bartender' || this.usuario.tipoEmpleado=='cocinero'){
              this.esEmpleado= true; 
            }else{
              this.esMetre= true;
            }
          }
          //this.actualizarChat(this.mesaUsuario);
        }
        this.spin = false;
      })
    })
    
    
  }

  verDetalle(pedido_id:any){ 
    console.log(pedido_id);
    this.router.navigate(['/detalle-pedido/', { pedido_id: pedido_id }]);
  }

 // let pedido = { productos: this.productosElegidos, usuario: this.usuarioLogueado, valorTotal: this.valorTotal, estado: 'pendiente' }
  cambiarEstado(pedido_sel:any,proxEstado:string) { 
    this.pedidos.forEach(pedido => {
     if(pedido.doc_id==pedido_sel.doc_id ){
      pedido.estado= (proxEstado=='CONFIRMADO' )? 'CONFIRMADO' : 'ENTREGADO';
    
      this.pedidosSrv.updateEstadoPedido(pedido)
     }
    }); 
  } 
  //solo el mozo
 /* finalizarPedido(pedido_sel:any,proxEstado:string){
     
       pedido_sel.estado= eEstadPedido.FINALIZADO; 
      this.pedidosSrv.actualizarProductoPedido(pedido_sel, pedido_sel.doc_id);
      //Eliminar mensajes
      this.msjSrv.borrarMensajesByMesa(pedido_sel.numero_mesa);
      //Liberar mesa y cliente
       setTimeout(() => { 
       }, 3000);
    }
*/


    // confirmarPago(pedidoID:string){
    //   let pedido;
    //   this.pedidosSrv.TraerPedido(pedidoID).subscribe((res) => {
    //      pedido = res;
    //     console.log('PEDIDO SELECCIONADO: ' +  pedido)
    //   });
    //    pedido.estado= eEstadPedido.COBRADO; 
    //   this.pedidosSrv.actualizarProductoPedido( pedido, pedidoID).then((res)=>{
    //     this.liberarMesa(pedidoID);
    //   });
    // }
  
    // liberarMesa(pedidoID:string){
    //   this.spinnerSrv.show();
    //   let pedido;
    //   this.pedidosSrv.TraerPedido(pedidoID).subscribe((res) => {
    //      pedido = res;
    //     console.log('PEDIDO SELECCIONADO: ' +  pedido)
    //      //finalizar pedido 
    //     pedido.estado= eEstadPedido.FINALIZADO; 
    //     this.pedidosSrv.actualizarProductoPedido(pedido, pedidoID);
    //     //Borrar mensajes
    //     this.msjSrv.borrarMensajesByMesa( pedido.numero_mesa);
    //     //Liberar mesa
    //     this.fireSrv.ActualizarMesaEstado( pedido.uid_mesa, false );
    //     //liberar usuario
    
    //     this.fireSrv.ActualizarClienteMesa( pedido.uid_usuario, '' );
    
    //   });

    //   setTimeout(() => {
    //     this.spinnerSrv.hide();
    //   }, 6000);
    // }
}
