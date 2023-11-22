import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { StatusBar } from '@capacitor/status-bar';
import { ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EncuestaClienteComponent } from '../encuesta-cliente/encuesta-cliente.component';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { AnyMxRecord } from 'dns';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent  implements OnInit {

  scanActive: boolean = false;
  usuario:any;
  isAdmin:boolean=false;
  isCliente:boolean=false;
  isBartender:boolean=false;
  isCocinero:boolean=false;
  isMozo:boolean=false;
  isMetre:boolean=false;
  tieneMesa:boolean=false;
  tipoEmpleado:string="";
  currentScan: any;
  spin!: boolean;
  spinner!:boolean;
  enListaEspera:boolean = false;
  mesa:any;
  mesaAsignada:boolean=true;
  usuarioAnonimo:any;
  pedidoRealizado!: boolean;
  encuestasAbierto! : boolean;
  listadoEncuestas! :any;
  pedido: any;
  pedidoEntregado!: boolean;
  usuarioMetre! : any;

  constructor(
    private qrScanner: QrscannerService,
    private router:Router,
    private usuarioService: UsuariosService,
    public afAuth:AngularFireAuth,
    private toastController: ToastController,
    private mesaService:MesaService,
    private pedidosService: PedidosService,
    private push: PushNotificationService,
    private activatedRoute: ActivatedRoute,
    private encuestasService: EncuestaService,
    private auth: Auth
  ){
    this.spin = true;
    this.spinner = false;
    this.enListaEspera = false;
    this.pedidoRealizado = false;
    this.encuestasAbierto = false;
    this.listadoEncuestas = [];
    this.tieneMesa = false;
    this.pedidoEntregado = false;
  }

  async ngOnInit(){
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.checkearUsuario();
    })
    setTimeout( ()=>{ this.spin = false; }, 2500)
  }

  checkearUsuario(){

    this.afAuth.currentUser.then(user=>{

      this.usuarioService.getListadoUsuarios().then(resp => {

        resp.forEach((usuario: any) => {
        if (usuario.data().email == user?.email) {
          if (usuario.data().tipo == "admin") {
            this.isAdmin = true;
          }else if(usuario.data().tipo == "cliente"){
            this.isCliente = true;
            this.enListaEspera = usuario.data().enListaDeEspera;
            if(usuario.data().mesa != ""){

              this.tieneMesa = true;
              this.mesaService.obtenerTodosLosMesas().then((data: any) => {
                data.forEach((mesa: any) => {
                  //VEEER DE PONER OBSERVABLE
                  if(mesa.numero == usuario.data().mesa.numero){
                    this.mesa = mesa;
                    if(mesa.ocupada == false){
                      this.mesaAsignada = false;
                      this.presentarToast('bottom', `Mesa asignada, ya podés ingresar a la mesa ${this.mesa.numero}`, 'success');
                    }
                  }

                });

              });
            }
          }else{
            this.tipoEmpleado = usuario.data().tipoEmpleado;
            if(this.tipoEmpleado == "bartender"){
              this.isBartender = true;
            }else if(this.tipoEmpleado == "cocinero"){
              this.isCocinero = true;
            }else if(this.tipoEmpleado == "metre"){
              this.isMetre = true;
            }
            else{
              this.isMozo = true;
            }
          }
          this.usuario = usuario.data();
        }
      });

      this.pedidosService.obtenerPedidos().then( resp=>{
        resp.forEach( (item:any) =>{
          if(item.data().num_mesa == this.usuario.mesa.numero &&
            item.data().estado != 'FINALIZADO' &&
            item.data().usuario.email == this.auth.currentUser?.email
            ){
            this.pedidoRealizado = true;
            this.pedido = item.data();
          }
        })
      });

      this.encuestasService.obtenerEncuestasClientes().then( resp => {
        resp.forEach( (item:any) =>{
          this.listadoEncuestas.push(item);
        })
      })

    });


  });
  }

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

  startScanner() {
    setTimeout(() => {
      this.scanActive = true;
      this.qrScanner.startScan().then((result) => {
        this.currentScan = result?.trim();
        console.log(this.currentScan);
        if(this.currentScan == 'home/listaEspera'){

          this.usuarioService.UpdateListadoEspera(this.usuario.id);
          this.presentarToast('bottom', 'Te encontrás en lista de espera, en unos minutos el metre te asignará una mesa.', 'success');
          this.usuarioService.getListadoUsuarios().then(resp => {
            resp.forEach((usuario: any) => {
              if(usuario.data().tipoEmpleado == 'metre'){
                this.push.enviarPushNotification({
                  registration_ids: [ usuario.data().token, ],
                  notification: {
                    title: 'Nuevo cliente en espera',
                    body: 'Un cliente se anotó en la lista de espera.',
                  },
                  data: {
                    ruta: 'home/listaEspera',
                  },
                }).subscribe( resp =>{
                  console.log(resp)
                })
              }
            })
          })
          this.enListaEspera = true;
      }
      else{
        this.presentarToast('bottom', 'El código QR no es válido.', 'danger');
      }
      this.scanActive = false;
      });
    }, 2500);
  } // end of startScan

  startScannerMesa() {
    setTimeout(() => {
      this.scanActive = true;
      this.qrScanner.startScan().then((result) => {
        this.currentScan = result?.trim();

        if(this.currentScan == this.mesa.numero){

          console.log(this.pedidoRealizado)
          if(this.pedidoRealizado){
            this.router.navigateByUrl('opciones-cliente');
            // console.log(this.pedidoEntregado)
            // if(this.pedido.estado === 'ENTREGADO'){
            //   console.log(this.pedidoEntregado)
              //this.router.navigateByUrl('estado-pedido');
              // this.pedidoEntregado = true;
              //alert(this.pedidoEntregado);
            //}
            // else{
            //   setTimeout(() => { this.router.navigateByUrl('estado-pedido'); }, 1000);
            // }

          }else{
            //
            this.mesaService.updateMesaOcupada(this.mesa, true);
            this.mesa.ocupada = true;
            this.usuarioService.UpdateMesaCliente(this.usuario.id, this.mesa)
            //
            this.mesaAsignada = true;
            this.presentarToast('bottom', 'Mesa asignada correctamente.', 'success');
            setTimeout(() => { this.router.navigateByUrl('menu-pedido'); }, 2000);
          }
        }
        else{
          this.presentarToast('bottom', `El código QR no es válido. Debe scannear la mesa ${this.mesa.numero}`, 'danger');
        }
        this.scanActive = false;
        });
    }, 1000);
  } // end of startScan

  stopScanner() {
    setTimeout(() => {
      this.scanActive = false;
      this.qrScanner.stopScanner();
    }, 1000);
  } // end of stopScan


  verEncuestas(abierto: boolean){
    this.encuestasAbierto = abierto;
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

  irAJuego(){
    this.router.navigate(['flechas']);
  }

  irAEncuesta(){
    this.router.navigate(['encuesta-clientes']);
  }
  irADetalle(){
    this.router.navigate(['detalle-pedido']);
  }
  verEstadisticas(){
    this.verEncuestas(false);
    this.spin = true;
    setTimeout(() => { this.router.navigateByUrl('graficos-encuestas'); this.spin = false;}, 1000);
  }
}
