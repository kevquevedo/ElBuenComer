import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ToastController } from '@ionic/angular';
import { Photo } from '@capacitor/camera';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-alta-dueno-supervisor',
  templateUrl: './alta-dueno-supervisor.component.html',
  styleUrls: ['./alta-dueno-supervisor.component.scss'],
})
export class AltaDuenoSupervisorComponent  implements OnInit {

  form!: FormGroup;
  spin!: boolean;
  usuario:Usuario;
  scanActive!: boolean;
  dniData:any;


  path:string='';
  scannnedResult: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authS: AngularFireAuth,
    private imagenServ: ImagenesService,
    private toastController: ToastController,
    //private firestore:FirestoreService,
    //private utilidadesSrv:UtilidadesService,
    //private imagenSrv:ImagenesService,
    //private auth:AuthService,
    //private spinner:NgxSpinnerService,
    //private utilSrv:UtilidadesService
  ){
    this.usuario = new Usuario();
    this.spin = true;
    this.scanActive = false;
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.email),
      pass: new FormControl('', Validators.minLength(6)),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      dni: new FormControl('', [ Validators.required, Validators.min(1000000), Validators.max(99999999) ]),
      cuil: new FormControl('', [ Validators.required, Validators.min(10000000000), Validators.max(99999999999) ]),
      perfil: new FormControl('', Validators.required),
    });
    setTimeout( ()=>{ this.spin = false; },2500)
  }

  get email(){
    return this.form.get('email');
  }
  get pass(){
    return this.form.get('clave');
  }
  get nombre(){
    return this.form.get('nombre');
  }
  get apellido(){
    return this.form.get('apellido');
  }
  get dni(){
    return this.form.get('dni');
  }
  get cuil(){
    return this.form.get('cuil');
  }
  get perfil(){
    return this.form.get('perfil');
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

  async startScan() {

    const permiso = await this.checkPermission();
    if (permiso) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      BarcodeScanner.showBackground(); //VEEEEEEEEEEEER
      if (result.hasContent) {

        this.dniData = result.content.split('@');
        let digitosCUIL = this.dniData[8];
        let cuil = digitosCUIL[0] + digitosCUIL[1] + this.dniData[4] + digitosCUIL[2];
        this.usuario.dni = this.dniData[4].trim();
        this.usuario.nombre = this.dniData[2].trim();
        this.usuario.apellido = this.dniData[1].trim();
        this.usuario.cuil = cuil.trim();
        this.form.controls['dni'].setValue(this.usuario.dni);
        this.form.controls['nombre'].setValue(this.usuario.nombre);
        this.form.controls['apellido'].setValue(this.usuario.apellido);
        this.form.controls['cuil'].setValue(this.usuario.cuil);

        this.scanActive = false;
      } else {
        this.stopScan();
      }
    } else {
      this.stopScan();
    }

  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanActive  = false;
  }

  // FUNCIONES DE CAMARA

  tomarFoto() {
    this.imagenServ.agregarFoto()
    .then(() => {
      this.presentToast('top', 'Se procesó OK la imagen. ')
    }
    ).catch((err:any) => {
      this.presentToast('top', 'Error al subir imagen: ' + err)
    })
    // this.sacarFoto();
  }

  // async sacarFoto() {


  // }

  //private async uploadPhoto(cameraPhoto: Photo) {

  //  const response = await fetch(cameraPhoto.webPath!);
  //  const blob = await response.blob();
  //  const filePath = this.getFilePath();

  //  const uploadTask = this.imagenServ.saveFile(blob, filePath);

    // uploadTask.then(async (res:any) => {
      //   const downloadURL = await res.ref.getDownloadURL();
      //   if (downloadURL.length > 0) {
        //     console.log("URL  CORRECTO- i_IMG++");
        //     this.usuario.foto = downloadURL;
        //   }
        // })
        // .catch((err:any) => {
          //   this.presentToast('top', 'Error al subir la imagen: ' + err)
          // });
  //}
  aceptar() {
    //this.spinner.show();
    //this.altaForm.get('perfil').value == 'dueño' ? this.usuario.tipo = eUsuario.dueño : this.usuario.tipo = eUsuario.supervisor;

  /*  this.auth.signIn(this.usuario.email, this.clave).then((userCredential)=>{
      this.firestore.crearUsuario(this.usuario).then((ok)=>{
          this.utilidadesSrv.successToast(this.usuario.tipo + " dado de alta exitosamente.");
          this.navigateTo('home');
      }).catch((err)=>{
        this.utilidadesSrv.errorToast(err);
      })
    }).catch((err)=>{

      this.Errores(err);
    });*/



    // this.auth.register(this.usuario.email, this.clave).then((credential:any)=>{
    //   console.log(credential.user.uid);
    //   this.usuario.uid = credential.user.uid;
    //   this.firestore.setItemWithId(this.usuario, credential.user.uid).then((usuario:any)=>{
    //     console.log(usuario);

    //     setTimeout(() => {
    //       //this.spinner.hide();
    //       //this.utilSrv.successToast('Registro exitoso');
    //       this.router.navigateByUrl('login')
    //     }, 3000);
    //   }).catch((err:any)=>{
    //     this.Errores(err);
    //     //this.utilSrv.vibracionError();
    //     console.log(err);
    //   });
    // }).catch((err:any)=>{
    //   this.Errores(err);
    //   //this.utilSrv.vibracionError();
    //   console.log(err);
    // });


  }

  getFilePath() {
    return new Date().getTime() + '-test';
  }

  // ngAfterViewInit(): void {
    //   BarcodeScanner.prepare();
  // }

  evaluarErrorLogin(error : string){
    console.log(error)
    switch(error){
      case 'auth/user-not-found':
        this.presentToast('top', 'El email no se encuentra registrado.')
      break;
      case 'auth/invalid-email':
        this.presentToast('top', 'El email ingresado es incorrecto.')
      break;
      case 'auth/wrong-password':
        this.presentToast('top', 'La contraseña es incorrecta.')
      break;
      case 'auth/missing-password':
        this.presentToast('top', 'Debe ingresar una contraseña.')
      break;
      case 'auth/invalid-login-credentials':
        this.presentToast('top', 'Los datos ingresados son incorrectos.')
      break;
      default:
        this.presentToast('top', 'Ocurrió un error inesperado.')
      break;
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
      color: 'danger'
    });
    await toast.present();
  }

}
