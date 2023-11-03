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
  email: string;
  clave: string;
  clave2: string;
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
  usuarios:any;
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
    this.email = '';
    this.clave = '';
    this.clave2 = '';
    this.usuario = new Usuario();
    this.spin = true;

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
      this.usuario.tipoEmpleado = '';
      this.usuario.cuil = 0;
      this.usuario.mesa = '';
      this.usuario.token = '';
      this.usuario.enListaDeEspera = false;
      alert(
        this.usuario.email +
        this.usuario.apellido +
        this.usuario.dni +this.usuario.tipo + this.usuario.clienteValidado
        );
      createUserWithEmailAndPassword(this.auth, this.email, this.clave).then( () => {
        this.usuario.uid = this.auth.currentUser?.uid;
        this.usuariosSvc.crearUsuario(this.usuario);
        //this.notificar();
        this.presentToast('middle', 'Se creó el usuario correctamente.', 'success', 1500 );
        setTimeout( ()=>{ this.router.navigateByUrl('home'); this.spin = false;}, 2000)
      })
      .catch( error => {
        this.spin = false;
        this.Errores(error);
        //this.presentToast('middle', 'Error al crear el usuario: ' + error, 'danger', 1500 );
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

 
  // notificar(){
  //   let tokens=[];
  //   this.usuarios.forEach(user => {   
  //     if(user.token!='' && user.tipo=='dueño' || user.tipo=='supervisor' ){
  //       tokens.push(user.token) 
  //     }
  //    });
     
  //    tokens.forEach(token => {
  //     this.pushSrv 
  //     .sendPushNotification({
  //       // eslint-disable-next-line @typescript-eslint/naming-convention
  //            /* registration_ids: [ 
  //             token 
  //             ], */
  //       to: token,      
  //       notification: {
  //         title: 'Nuevo cliente',
  //         body: 'Se registro un nuevo cliente',
  //       },
  //       data: {
  //         ruta: 'listado-clientes-pendientes', 
  //       },
  //     }).pipe(first()).subscribe((data)=>{
  //       console.log(data) 
  //     }) 
  //    });

 
  // }

  navigateTo(url: string) {
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 2000);
  }

  tomarFoto() {
    this.imagesSrv.agregarFoto()
    .then((url:any) => {
      //alert(url);
      this.usuario.foto = url;
      this.fotoHabilitar = true;
      this.presentToast('middle', 'Se procesó con éxito la imagen', "success", 1500);
    }
    ).catch((err:any) => {
      alert(err);
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
        //alert(this.currentScan);
        if (this.currentScan) {
          this.dniData = this.currentScan.split('@');
          //let digitosCUIL = this.dniData[8];
          //let cuil = digitosCUIL[0] + digitosCUIL[1] + this.dniData[4] + digitosCUIL[2];
          this.usuario.dni = this.dniData[4].trim();
          this.usuario.nombre = this.dniData[2].trim();
          this.usuario.apellido = this.dniData[1].trim();
          alert(this.usuario.nombre);
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



  // async startScan() {

  //   const permiso = await this.checkPermission();
  //   if (permiso) {
  //     this.scanActive = true;
  //     BarcodeScanner.hideBackground();
  //     const result = await BarcodeScanner.startScan();
  //     BarcodeScanner.showBackground(); //VEEEEEEEEEEEER
  //     if (result.hasContent) {

  //       this.dniData = result.content.split('@');
  //       this.nombre= this.dniData[2].trim();;
  //       this.apellido= this.dniData[1].trim();;
  //       this.dni= this.dniData[4].trim();;
  //       this.usuario.dni = this.dniData[4].trim();
  //       this.usuario.nombre = this.dniData[2].trim();
  //       this.usuario.apellido = this.dniData[1].trim();
  //       this.altaForm.controls['dni'].setValue(this.usuario.dni);
  //       this.altaForm.controls['nombre'].setValue(this.usuario.nombre);
  //       this.altaForm.controls['apellido'].setValue(this.usuario.apellido);
  //       this.altaForm.controls['cuil'].setValue(this.usuario.cuil);

  //       this.stopScan();
  //     } else {
  //       this.stopScan();
  //     }
  //   } else {
  //     this.stopScan();
  //   }

  // }

  // stopScan() {
  //   BarcodeScanner.showBackground();
  //   BarcodeScanner.stopScan();
  //   this.scanActive  = false;
  // }



  Errores(error:any)
  {
    if(error.code == 'auth/email-already-in-use')
      {
        this.presentToast('middle', 'El correo ya está en uso.', "danger", 1500);
      }
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error')
      {
        this.presentToast('middle', 'No pueden quedar campos vacíos.', "danger", 1500);
      }
      else if(error.code == 'auth/weak-password')
      {
        this.presentToast('middle', 'La contraseña debe tener al menos 8 caracteres.', "danger", 1500);
      }
      else
      {
        this.presentToast('middle', 'Correo o contraseña inválidos.', "danger", 1500);
      }
  }

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
    this.usuarios.forEach((user:any) => {   
      if(user.token!='' && user.tipo=='dueño' || user.tipo=='supervisor' ){
        tokens.push(user.token) 
      }
     });
     alert(tokens);
     tokens.forEach(token => {
      this.pushNotiSrv 
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
             /* registration_ids: [ 
              token 
              ], */
        to: token,      
        notification: {
          title: 'Nuevo cliente',
          body: 'Se registro un nuevo cliente',
        },
        data: {
          ruta: 'home', 
        },
      }).pipe(first()).subscribe((data:any)=>{
        console.log(data) 
      }) 
     });

 
  }




}

