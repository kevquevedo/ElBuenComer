import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Photo } from '@capacitor/camera';
import { ImagesService } from 'src/app/services/images.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';


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
  fotoUrl='./../../assets/sacarfoto.png';
  usuarios:any;
  constructor(
    //private spinner: NgxSpinnerService,
    private fromBuilder: FormBuilder,
    private router: Router ,
    private imagesSrv:ImagesService,
   // private utilidadesSrv:UtilidadesService,
    private usersSvc: UsersService,
    //private authSvc: AuthService,
    //private mail:MailService,
    //private pushSrv:NotificationService
    private toastr: ToastrService,
    private authSvc: AuthService
  ) {
    this.email = '';
    this.clave = '';
    this.clave2 = '';
    //this.usuario = new Usuario();

  }

  ngOnInit() {

    this.altaForm = this.fromBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      dni: ['', Validators.compose([Validators.required, Validators.min(10000000), Validators.max(99999999)])],
      email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      clave: ["", Validators.required],
      //clave2: ["", [Validators.required, this.comparePassValidator(this.altaForm.value.clave1, this.altaForm.value.clave2)]]
      clave2: ["", Validators.compose([Validators.required])],

    });

    this.altaFormAnonimo = this.fromBuilder.group({
      'nombre': ['', Validators.required]
    });


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
    // this.spinner.show();
    if(!this.anonimo){
      this.usuario.email = this.altaForm.value.email;
      this.usuario.nombre = this.altaForm.value.nombre;
      this.usuario.apellido = this.altaForm.value.apellido;
      this.usuario.dni = this.altaForm.value.dni;
      this.usuario.tipo = eUsuario.cliente;
      this.usuario.nombre = this.altaForm.value.nombre;

      this.authSvc.Register(this.usuario.email, this.clave).then((credential:any)=>{
        console.log(credential.user.uid);
        this.usuario.uid = credential.user.uid;
        this.usersSvc.setItemWithId(this.usuario, credential.user.uid).then((usuario:any)=>{
          console.log(usuario);
          //this.mail.enviarEmail(this.usuario.nombre, this.usuario.email, "Su cuenta ha sido registrada exitosamente, aguarde a que sea validada por nuestro personal.")
          //this.notificar();
          setTimeout(() => {
            //this.spinner.hide();
            this.toastr.success('Registro exitoso');
            this.router.navigateByUrl('login')
          }, 3000); 
        }).catch((err:any)=>{
          this.Errores(err);
          //this.utilidadesSrv.vibracionError();
          console.log(err);
        });
      }).catch((err:any)=>{
        this.Errores(err);
        //this.utilidadesSrv.vibracionError();
        console.log(err);
      }); 
    }
    else{
      this.usuario.nombre = this.altaFormAnonimo.value.nombre;
      this.usuario.tipo = eUsuario.cliente;
      this.usuario.clienteValidado = 'aceptado';
      // this.firestoreSvc.crearUsuario(this.usuario).then((res:any)=>{
      //   this.pushSrv.RegisterFCM(res)
      //   console.log("id del anonimo "+res)
      // });

      setTimeout(() => {
        //this.utilidadesSrv.successToast("Ingreso exitoso.");
        this.navigateTo('qr-ingreso-local');
      }, 5000);

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
    this.addPhotoToGallery();
  }

  async addPhotoToGallery() {
    const photo = await this.imagesSrv.addNewToGallery();
    //this.spinner.show();
    this.uploadPhoto(photo).then(() => {
       
      setTimeout(() => {
        this.fotoHabilitar = true; 
        //this.spinner.hide();
      }, 5000);

    }
    ).catch((err) => { 

      console.log("Error addPhotoToGallery", err);
    })
  }

  private async uploadPhoto(cameraPhoto: Photo) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();

    const uploadTask = this.imagesSrv.saveFile(blob, filePath);
    
    uploadTask.then(async (res:any) => {
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        console.log("URL  CORRECTO- i_IMG++");
        this.fotoUrl= downloadURL;
        console.log("IMAGEN CARGADA CORRECTAMENTE");
        return this.usuario.foto = downloadURL;
        
      }
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });
  }

  getFilePath() {
    return new Date().getTime() + '-test';
  }



  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (error) {
      //this.utilidadesSrv.vibracionError();
      this.toastr.error('No tiene permisos.',"Error", {timeOut: 1000});
      console.log(error);
      return false;
    }
  }

  async startScan() {

    try {
      const bodyElement1 = document.querySelector('body');
      if (bodyElement1) {
        bodyElement1.classList.remove('scanner-active');
      } else {
        console.error('No se encontró el elemento body');
      }
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      this.scanActive = true;
      await BarcodeScanner.hideBackground();
      const bodyElement2 = document.querySelector('body');
      if (bodyElement2) {
        bodyElement2.classList.remove('scanner-active');
      } else {
        console.error('No se encontró el elemento body');
      }
      this.content_visibility = 'hidden';
      this.scan_visibility = '';
      const result = await BarcodeScanner.startScan();

      this.content_visibility = '';
      this.scan_visibility = 'hidden';
      BarcodeScanner.showBackground();
      const bodyElement = document.querySelector('body');
      if (bodyElement) {
        bodyElement.classList.remove('scanner-active');
      } else {
        console.error('No se encontró el elemento body');
      }

      if (result?.hasContent) { 
        this.dniData = result.content.split('@'); 
        this.nombre= this.dniData[2];
        this.apellido= this.dniData[1];
        this.dni= this.dniData[4];
        const bodyElement = document.querySelector('body');
        if (bodyElement) {
          bodyElement.classList.remove('scanner-active');
        } else {
          console.error('No se encontró el elemento body');
        }
        this.scanActive = false; 
      }
    } catch (error) {
      console.log(error);
      //this.utilidadesSrv.vibracionError();
      this.toastr.error('Error al escanear el documento.',"Error", {timeOut: 1000});
      const bodyElement = document.querySelector('body');
      if (bodyElement) {
        bodyElement.classList.remove('scanner-active');
      } else {
        console.error('No se encontró el elemento body');
      }
      this.stopScan();
    } 
  }

 

  stopScan() {
    setTimeout(() => { 
    }, 3000);
    this.content_visibility = '';
    this.scan_visibility = 'hidden';
    this.scanActive = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    const bodyElement = document.querySelector('body');
    if (bodyElement) {
      bodyElement.classList.remove('scanner-active');
    } else {
      console.error('No se encontró el elemento body');
    }
  }

  ngAfterViewInit(): void {
    BarcodeScanner.prepare();
  }

  Errores(error:any)
  {
    if(error.code == 'auth/email-already-in-use')
      {
        this.toastr.error('El correo ya está en uso.',"Error", {timeOut: 1000});
      }
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error')
      {
        this.toastr.error('No pueden quedar campos vacíos.',"Error", {timeOut: 1000});
      }
      else if(error.code == 'auth/weak-password')
      {
        this.toastr.error('La contraseña debe tener al menos 8 caracteres.',"Error", {timeOut: 1000});
      }
      else
      {
        this.toastr.error('Correo o contraseña inválidos.',"Error", {timeOut: 1000});
      }
  }

}

export class Usuario {
  email!: string;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: number;
  foto: string;
  uid: string;
  tipo!: eUsuario;
  tipoEmpleado!: eEmpleado;
  enListaDeEspera: boolean;
  mesa: string;
  clienteValidado: string;
  token:string;
  constructor(){
      this.nombre= '';
      this.apellido= '';
      this.dni= 0;
      this.cuil= 0;
      this.foto= '';
      this.uid= '';
      this.enListaDeEspera = false;
      this.mesa = '';
      this.clienteValidado = '';
      this.token='';
  }
}

export enum eUsuario{
dueño='dueño',
supervisor='supervisor',
empleado='empleado',
cliente='cliente',
}

export enum eEmpleado{
metre='metre',
mozo='mozo',
cocinero='cocinero',
bartender='bartender'
}