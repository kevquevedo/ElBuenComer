import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { NotificationService } from 'src/app/services/notification.service';

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
  fotoUrl!:string;
  spinner!: boolean;
  currentScan!:any;

  constructor(

    private qrScanner: QrscannerService ,
    private router: Router,
    private imagenServ: ImagenesService,
    private toastController: ToastController,
    private auth: Auth,
    private usuarioServ: UsuariosService,
    private pushNotiSrv:NotificationService
  ){
    this.usuario = new Usuario();
    this.spin = true;
    this.scanActive = false;
    this.fotoUrl = '';
    this.spinner = false;
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.email),
      pass: new FormControl('', Validators.minLength(6)),
      nombre: new FormControl('', [ Validators.required, Validators.pattern('^[a-zA-Z]+$') ]),
      apellido: new FormControl('', [ Validators.required, Validators.pattern('^[a-zA-Z]+$') ]),
      dni: new FormControl('', [ Validators.required, Validators.min(1000000), Validators.max(99999999),Validators.pattern('^[0-9]{8}$') ]),
      cuil: new FormControl('', [ Validators.required, Validators.min(10000000000), Validators.max(99999999999),Validators.pattern('^[0-9]{11}$') ]),
      perfil: new FormControl('', Validators.required),
    });
    setTimeout( ()=>{ this.spin = false; }, 2500)
  }

  get email(){
    return this.form.get('email');
  }
  get pass(){
    return this.form.get('pass');
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
        console.log(this.currentScan);
        if (this.currentScan) {

          this.dniData = this.currentScan.split('@');
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


  // FUNCIONES DE CAMARA
  tomarFoto() {
    this.imagenServ.agregarFoto()
    .then((url :any)=> {
      this.usuario.foto = url;
      this.fotoUrl = url;
      this.presentToast('top', 'Se procesó correctamente la imagen.', 'success')
    }).catch((err:any) => {
      this.presentToast('top', 'Error al subir imagen: ' + err, 'danger')
    })
  }

  async aceptar() {

    if(this.evaluarErrores()){
      this.spinner = true;
      this.usuario.email = this.email?.value;
      this.usuario.tipoEmpleado = this.perfil?.value;
      this.usuario.dni = this.dni?.value;
      this.usuario.nombre = this.nombre?.value;
      this.usuario.apellido = this.apellido?.value;
      this.usuario.cuil = this.cuil?.value;
      this.usuario.tipo = 'admin';
      this.usuario.clienteValidado = 'aceptado';
      createUserWithEmailAndPassword(this.auth, this.email?.value, this.pass?.value).then( () => {
        this.usuario.uid = this.auth.currentUser?.uid;
        this.usuarioServ.crearUsuario(this.usuario);
        this.presentToast('middle', 'Se creó el usuario correctamente.', 'success');
        setTimeout( ()=>{ this.router.navigateByUrl('home'); this.spinner = false; }, 2000);
      })
      .catch( (error:any) => {
        this.spinner = false;
        this.presentToast('middle', 'Error al crear el usuario: ' + error, 'danger')
      })
    }
  }

  evaluarErrores() : boolean{
    let retorno = true;
    if(!this.perfil?.valid){
      this.presentToast('middle', 'Debe seleccionar un perfil de usuario.', 'danger')
      retorno = false;
    }
    if(this.nombre?.value == ''){
      this.presentToast('middle', 'Debe indicar un nombre.', 'danger')
      retorno = false;
    }
    if(this.apellido?.value == ''){
      this.presentToast('middle', 'Debe indicar un apellido.', 'danger')
      retorno = false;
    }
    if(!this.dni?.valid){
      this.presentToast('middle', 'Debe indicar un DNI válido.', 'danger')
      retorno = false;
    }
    if(!this.cuil?.valid){
      this.presentToast('middle', 'Debe indicar un cuil válido.', 'danger')
      retorno = false;
    }
    if(!this.email?.valid){
      this.presentToast('middle', 'Debe indicar un email válido.', 'danger')
      retorno = false;
    }
    if(!this.pass?.valid){
      this.presentToast('middle', 'Debe indicar una contraseña válida.', 'danger')
      retorno = false;
    }
    if(this.fotoUrl == ''){
      this.presentToast('middle', 'Debe subir una foto de perfil.', 'danger')
      retorno = false;
    }
    return retorno;
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
