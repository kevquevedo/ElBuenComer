import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
})
export class DetallePedidoComponent implements OnInit {

  pedido_id: any = '';
  pedido: any = {
    numero_mesa: 0
  };

  sectorUserActual = '';//
  usuario: any;
  esCliente = false;
  esMetre = false;
  esEmpleado = false;
  pedidoLS: any;
  scanActive = false;
  content_visibility = '';
  scan_visibility = 'hidden';
  satisfaccionPorcent!: string;
  usuarios: any;
  spin = true;
  currentScan: any;

  constructor(
    private route: ActivatedRoute,
    private pedidoSrv: PedidosService,
    private auth: Auth,
    private userSrv: UsuariosService,
    private qrScanner: QrscannerService,
    private mesaSvc: MesaService
    // private msjSrv: MensajeService,
    //private utilidadesSrv: UtilidadesService,
    //private spinnerSrv: NgxSpinnerService,
    //private pushSrv: NotificationService
  ) {
    // this.route.snapshot.paramMap.get('doc_id')
    this.pedido_id = this.route.snapshot.paramMap.get('pedido_id');
    console.log(this.pedido_id);
  }

  ngOnInit() {

    this.userSrv.getListadoUsuarios().then((resp: any) => {
      this.usuarios = resp;
      resp.forEach((item: any) => {
        if (item.data().email == this.auth.currentUser?.email) {
          // this.mesaUsuario = item.data().mesa.numero;
          this.usuario = item.data();
          //this.actualizarChat(this.mesaUsuario);
          if (this.usuario.tipo == 'cliente') {
            this.esCliente = true;
            this.esMetre = false;
            this.esEmpleado = false;
          } else if (this.usuario.tipo == 'empleado') {
            if (this.usuario.tipoEmpleado == 'bartender') {
              this.esEmpleado = true;
              this.esCliente = false;
              this.esMetre = false;
              this.sectorUserActual = 'bebida';
            } else if (this.usuario.tipoEmpleado == 'cocinero') {
              this.esEmpleado = true;
              this.esCliente = false;
              this.esMetre = false;
              this.sectorUserActual = 'cocina';
            } else {
              this.esMetre = true;
              this.esCliente = false;
              this.esEmpleado = false;
            }
            console.log(this.sectorUserActual);
          }
          if (this.esCliente) {

            this.pedidoSrv.obtenerPedidoPorIdUsuario(this.usuario.id).then((res) => {
              this.pedido = res;
              console.log('PEDIDO SELECCIONADO: ' + JSON.stringify(this.pedido));
            });
            /* this.pedidoLS= localStorage.getItem('pedido');
              if(this.pedidoLS != null  ){
                this.pedidoLS= JSON.parse(this.pedidoLS); 
                this.pedido =this.pedidoLS;
                this.pedidoSrv.TraerPedido(this.pedido.pedidoID).subscribe((res) => {
                  this.pedido = res;
                  console.log('PEDIDO SELECCIONADO: ' + this.pedido)
                });
                } */
          } else {
            this.pedidoSrv.obtenerPedidoPorId(this.pedido_id).then((res) => {
              this.pedido = res;
              console.log('PEDIDO SELECCIONADO: ' + this.pedido);
            });
      
          }
          this.spin = false;
        }
      })
    })

    //this.usuario = this.authSrv.getCurrentUserLS();

   

   


  }

  confirmarPedido(pedido_sel: any, proxEstado: string) {

    this.pedido.estado = 'confirmado' ? 'confirmado' : 'entregado';
    if (this.pedido.estado == 'confirmado') {
      this.notificar(pedido_sel)
    }


    this.pedidoSrv.updateEstadoPedido(this.pedido)

  }

  cambiarEstado(item: any, proxEstado: string) {
    let cantProdPedido = this.pedido.productos.length;

    let productosTerminados = 0;
    if (this.pedido.estado == 'confirmado') {
      this.pedido.estado = 'en elaboración';
    }

    item.estadoProductoPedido = (proxEstado == 'en elaboración') ? 'en elaboración' : 'terminado';
    this.pedido.productos.forEach((prod:any) => {
      if (prod.doc_id == item.doc_id) {
        prod = item
      }
    });

    this.pedido.productos.forEach((producto: any) => {
      if (producto.estadoProductoPedido == 'terminado') {
        productosTerminados++;

      }
    });

    if (productosTerminados == cantProdPedido) {
      this.pedido.estado = 'terminado';
      console.log('PRODUCTO TERMINADO');

      this.notificarPedidoTerminado(this.pedido)
    }
    console.log('ESTADO  GENERAL DESPUES DE CADA SECTOR:' + this.pedido.estado)
    this.pedidoSrv.updateEstadoPedido(this.pedido)
  }

  confirmarRecepcion(pedidoID: string) {
    console.log('Pedido recibido: ' + pedidoID)
    this.pedido.estado = 'recibido';
    this.pedidoSrv.updateEstadoPedido(this.pedido);
  }

  pedirCuenta(pedidoID: string) {
    this.pedido.estado = 'cuenta';
    this.pedidoSrv.updateEstadoPedido(this.pedido);
  }

  pagarPedido(pedidoID: string) {
    let descuentoCalcu = (this.pedido.total * this.pedido.descuento) / 100;
    this.pedido.estado = 'pagado';
    this.pedido.total = this.pedido.total + this.pedido.propina - descuentoCalcu;
    this.pedidoSrv.updateEstadoPedido(this.pedido);
  }

  confirmarPago(pedidoID: string) {
    this.pedido.estado = 'cobrado';
    this.pedidoSrv.updateEstadoPedido(this.pedido)//.then(() => {
      this.liberarMesa( this.pedido.id)
    //});


  }

  liberarMesa(pedidoID: string) {
    this.spin = true;
    this.pedido.estado = 'finalizado';
    //finalizar pedido
    this.pedidoSrv.updateEstadoPedido(this.pedido);
    //Borrar mensajes
    //this.msjSrv.borrarMensajesByMesa(this.pedido.numero_mesa);
    //Liberar mesa
    this.mesaSvc.updateMesaOcupada(this.pedido.uid_mesa, false);
    //liberar usuario

    this.userSrv.UpdateMesaCliente(this.pedido.usuario.id, '');

    setTimeout(() => {
      this.spin = false;
    }, 5000);
  }

  manejarPropina() {
    if (this.satisfaccionPorcent == '0%') {
      //sin propina
      this.pedido.nivelSatisfaccion = '0%';
      this.pedido.propina = 0;
    } else if (this.satisfaccionPorcent == '5%') {
      this.pedido.nivelSatisfaccion = '5%';
      this.pedido.propina = this.pedido.total * 0.05;
    } else if (this.satisfaccionPorcent == '10%') {
      this.pedido.nivelSatisfaccion = '10%';
      this.pedido.propina = this.pedido.total * 0.10;
    } else if (this.satisfaccionPorcent == '15%') {
      this.pedido.nivelSatisfaccion = '15%';
      this.pedido.propina = this.pedido.total * 0.15;
    } else if (this.satisfaccionPorcent == '20%') {
      this.pedido.nivelSatisfaccion = '20%';
      this.pedido.propina = this.pedido.total * 0.20;

    } else {
     // this.utilidadesSrv.errorToast('Escanee un qr de propina', 6000)
    }


  }




    // FUNCIONES DE ESCANER
    async checkPermission() {
      return new Promise(async (resolve, reject) => {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          resolve(true);
        } else if (status.denied) {
          BarcodeScanner.openAppSettings();
          resolve(false);
        }
      });
    }

  startScan() {
    setTimeout(() => {
      this.scanActive = true;
      this.qrScanner.startScan().then((result) => {
        this.currentScan = result?.trim();
        if (this.currentScan) {
          this.satisfaccionPorcent = this.currentScan;
          this.manejarPropina();
        }
        this.scanActive = false;
        
      });
    }, 2000);
  } // end of startScan


  stopScan() {
    setTimeout(() => {
      this.scanActive = false;
      this.qrScanner.stopScanner();
    }, 2000);
  } // end of stopScan


  notificarPedidoTerminado(pedido: any) {
    this.usuarios.forEach((user:any) => {

      if (user.token != '' && user.tipo == 'empleado' && (user.tipoEmpleado == 'metre' || user.tipoEmpleado == 'mozo')) {

        // this.pushSrv
        //   .sendPushNotification({
        //     // eslint-disable-next-line @typescript-eslint/naming-convention
        //     registration_ids: [
        //       // eslint-disable-next-line max-len
        //       user.token
        //     ],
        //     notification: {
        //       title: 'Pedido terminado',
        //       body: 'Pedido listo para entregar Mesa: ' + pedido.numero_mesa,
        //     },
        //     data: {
        //       ruta: 'detalle-pedido',
        //       pedido_id: pedido.doc_id
        //     },
        //   })
        //   .subscribe((data:any) => {
        //     console.log(data);
        //   });

      }
    });

  }

  notificar(pedido: any) {
    this.usuarios.forEach((user:any) => {

      if (user.token != '' && user.tipo == 'empleado' && (user.tipoEmpleado == 'cocinero' || user.tipoEmpleado == 'bartender')) {


    //     this.pushSrv
    //       .sendPushNotification({
    //         // eslint-disable-next-line @typescript-eslint/naming-convention
    //         registration_ids: [
    //           // eslint-disable-next-line max-len
    //           user.token
    //         ],
    //         notification: {
    //           title: 'Nuevo pedido',
    //           body: 'Mesa: ' + pedido.numero_mesa,
    //         },
    //         data: {
    //           ruta: 'listado-pedidos'
    //         },
    //       })
    //       .subscribe((data:any) => {
    //         console.log(data);
    //       });

     }
     });

  }

  // pedidosDeSuSector(userTipo: string, pedido: any): boolean {
  //   let sectorUsuario = '';
  //   if (userTipo == 'cocinero') {
  //     sectorUsuario = 'COCINA'
  //   } else if (userTipo == 'bartender') {
  //     sectorUsuario = 'BEBIDA'
  //   }

  //   pedido.productos.forEach((element:any) => {
  //     if (element.sector == sectorUsuario) {
  //       return true;
  //     }
  //   });
  //   return false;
  // }

  pedidosDeSuSector(userTipo: string, pedido: any): boolean {
    let sectorUsuario = '';
    
    if (userTipo == 'cocinero') {
      sectorUsuario = 'COCINA';
    } else if (userTipo == 'bartender') {
      sectorUsuario = 'BEBIDA';
    }
  
    // Utilizamos el método `some` en lugar de `forEach`
    return pedido.productos.some((element: any) => {
      return element.sector === sectorUsuario;
    });
  }

}
