import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Photo } from '@capacitor/camera';
import { AuthService } from 'src/app/services/auth.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ToastController } from '@ionic/angular';
import { Usuario, eUsuario } from 'src/app/clases/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificationService } from 'src/app/services/notification.service';
import { first } from 'rxjs/operators';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';



@Component({
  selector: 'app-alta-clientes',
  templateUrl: './alta-clientes.component.html',
  styleUrls: ['./alta-clientes.component.scss'],
})
export class AltaClientesComponent  implements OnInit {

  usuario!: Usuario;
  email!: string;
  clave!: string;
  clave2!: string;
  show_error: boolean = false; //
  descripcion_error: string = '';
  public altaForm!: FormGroup;
  public altaFormAnonimo!: FormGroup;
  fotoHabilitar:boolean=false;
  path:string='';
  anonimo:boolean = false;
  scannnedResult: any;
  content_visibility = '';
  scan_visibility = 'hidden';
  scanActive = false;
  dniData:any;
  nombre='';
  apellido='';
  dni='';
  fotoUrl='../../assets/sacarfoto.png';
  listadoClientes = new Array<any>();
  spin: boolean = false;
  currentScan: any;

  constructor(
    //private spinner: NgxSpinnerService,
    private fromBuilder: FormBuilder,
    private router: Router ,
    private imagesSrv:ImagenesService,
   // private utilidadesSrv:UtilidadesService,
    private usuariosSvc: UsuariosService,
    //private authSvc: AuthService,
    //private mail:MailService,
    private pushNotiSrv:NotificationService,
    private toastr: ToastController,
    private authSvc: AuthService,
    private qrScanner: QrscannerService,
    private auth: Auth,
  ) {

    this.usuario = new Usuario();
    this.spin = true;
    this.usuariosSvc.getListadoUsuarios().then(res => {
      if(res.size > 0){
        this.listadoClientes = [];
        res.forEach((usuario: any) => {
          console.log(usuario.data());
          if (usuario.data().tipoEmpleado == 'dueño') {
            this.listadoClientes.push(usuario.data())
          }
        });
        console.log(this.listadoClientes);
      }
    })
   

  }

  ngOnInit() {

    this.altaForm = this.fromBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      dni: ['', Validators.compose([Validators.required, Validators.min(10000000), Validators.max(99999999)])],
      email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clave: ["", Validators.required],
      //clave2: ["", [Validators.required, this.comparePassValidator(this.altaForm.value.clave1, this.altaForm.value.clave2)]]
      //clave2: ["", Validators.compose([Validators.required])],

    });

    this.altaFormAnonimo = this.fromBuilder.group({
      'nombre': ['', Validators.required]
    });

    setTimeout( ()=>{ this.spin = false; }, 2000)


    // this.firestoreSvc.obtenerUsuariosByTipo(eUsuario.dueño).subscribe((res)=>{
    //   this.usuarios= res;
    // })
  }

  comparePassValidator(clave1: AbstractControl, clave2: AbstractControl) {
    return () => {
    if (clave1.value !== clave2.value)
      return { match_error: 'Las claves no coincides.' };
    return null;
  };

}


  aceptar() {
    this.spin = true;
    if(!this.anonimo){

      this.usuario.email = this.altaForm.value.email;
      this.usuario.nombre = this.altaForm.value.nombre;
      this.usuario.apellido = this.altaForm.value.apellido;
      this.usuario.dni = this.altaForm.value.dni;
      this.usuario.tipo = eUsuario.cliente;
      this.usuario.clienteValidado = 'pendiente';
      this.usuario.tipoEmpleado = 'registrado';
      this.usuario.cuil = 0;
      this.usuario.mesa = '';
      this.usuario.token = '';
      this.usuario.enListaDeEspera = false;
      createUserWithEmailAndPassword(this.auth, this.usuario.email, this.altaForm.value.clave).then( () => {
        this.usuario.uid = this.auth.currentUser?.uid;
        //alert(JSON.stringify(this.usuario));
        this.usuariosSvc.crearUsuario(this.usuario);
        //this.pushNotiSrv.initializePushNotifications(this.usuario.uid);
        this.notificar();
        this.presentToast('middle', 'Se creó el usuario correctamente.', 'success', 1500 );
        setTimeout( ()=>{ this.router.navigateByUrl('home'); this.spin = false;}, 2000)
      })
      .catch( error => {
        this.spin = false;
        // this.Errores(error);
        alert(error);
        this.presentToast('middle', 'Error al crear el usuario: ' + error, 'danger', 1500 );
      })

    }
    else{
      this.usuario.nombre = this.altaFormAnonimo.value.nombre;
      this.usuario.tipo = eUsuario.cliente;
      this.usuario.clienteValidado = 'aceptado';
      this.usuariosSvc.crearUsuario(this.usuario).then(() =>{
        this.spin = false;
        setTimeout(() => {
          //this.utilidadesSrv.successToast("Ingreso exitoso.");
          this.navigateTo('');
        }, 2000);
      })
      .catch( error => {
        this.spin = false;
        this.presentToast('middle', 'Error al crear el usuario', 'danger', 1500 );
      })
    }

  }



  navigateTo(url: string) {
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 2000);
  }

  tomarFoto() {
    this.imagesSrv.agregarFoto()
    .then((url:any) => {
      this.usuario.foto = url;
      this.fotoHabilitar = true;
      this.presentToast('middle', 'Se procesó con éxito la imagen', "success", 1500);
    }
    ).catch((err:any) => {
      this.presentToast('middle', 'Error al subir imagen: '  + err, "danger", 1500);
    })
    // this.sacarFoto();
  }



  getFilePath() {
    return new Date().getTime() + '-test';
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
          this.dniData = this.currentScan.split('@');
          //let digitosCUIL = this.dniData[8];
          //let cuil = digitosCUIL[0] + digitosCUIL[1] + this.dniData[4] + digitosCUIL[2];
          this.usuario.dni = this.dniData[4].trim();
          this.usuario.nombre = this.dniData[2].trim();
          this.usuario.apellido = this.dniData[1].trim();
          //this.usuario.cuil = cuil.trim();
          this.altaForm.controls['dni'].setValue(this.usuario.dni);
          this.altaForm.controls['nombre'].setValue(this.usuario.nombre);
          this.altaForm.controls['apellido'].setValue(this.usuario.apellido);;
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


  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color:string, duration: number) {
    const toast = await this.toastr.create({
      message: mensaje,
      duration: duration,
      position: position,
      color: color
    });
    await toast.present();
  }

  notificar(){
    let tokens: any[] = [];
    
    alert(JSON.stringify(this.listadoClientes));
    this.listadoClientes.forEach((user:any) => {
      if(user.token!='' && user.tipo=='dueño' || user.tipo=='supervisor' ){
        tokens.push(user.token)
      }
     });
     tokens.forEach(token => {
      this.pushNotiSrv
      .sendPushNotification(token, 'registros-pendientes', 'Nuevo Cliente', 'Se registro un nuevo cliente');
     });


  }




}

