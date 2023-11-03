import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { StatusBar } from '@capacitor/status-bar';
import { ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

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
  constructor(private qrScanner: QrscannerService ,private router:Router,private usuarioService: UsuariosService ,
    public afAuth:AngularFireAuth,private toastController: ToastController)
  {
    this.spin = true;
    this.spinner = false;
  }
  async ngOnInit()
  {
    this.afAuth.currentUser.then(user=>{
      this.usuarioService.getListadoUsuarios().then(resp => {
        resp.forEach((usuario: any) => {
        if (usuario.data().email == user?.email) {
          if (usuario.data().tipo == "admin") {
            this.isAdmin = true;
          }else if(usuario.data().tipo == "cliente"){
            this.isCliente = true;
            if(usuario.data().mesa != ""){
              this.tieneMesa = true;
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
      }
      );
    }
    );
    });
    setTimeout( ()=>{ this.spin = false; }, 2500)
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
        this.usuarioService.UpdateListadoEspera(this.usuario.id);
        this.scanActive = false;
        this.presentarToast('middle', 'Te encontrás en lista de espera, en unos minutos el metre te asignará una mesa.', 'success');
        this.enListaEspera = true;
      });
    }, 2000);
  } // end of startScan

  stopScanner() {
    setTimeout(() => {
      this.scanActive = false;
      this.qrScanner.stopScanner();
    }, 2000);
  } // end of stopScan




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
