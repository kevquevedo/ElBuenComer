import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.component.html',
  styleUrls: ['./encuesta-cliente.component.scss'],
})
export class EncuestaClienteComponent implements OnInit {

  form!: FormGroup;
  fotos: FormData = new FormData();
  encuestas: Array<any> = [];
  usuarioActual: any;
  pedido: any;
  i_NroImagen: any;
  toastr: any;
  spin: boolean = false;
  usuarioUID! : any;
  idPedido! :any;

  constructor(private router: Router,
    //public firestore: FirestoreService,
    private fb: FormBuilder,
    //private utilidades:UtilidadesService,
    //private spinner: NgxSpinnerService,
    //private pedidoSrv:PedidosService,
    private encuestasSvc: EncuestaService,
    private usuarioSvc: UsuariosService,
    private auth: Auth,
    private pedidosService: PedidosService,
    private toastController: ToastController
    //private firestoreSvc:FirestoreService,
  ) {

    this.usuarioUID = '';
    this.form = this.fb.group({
      'puntaje': ['', Validators.required],
      'inconvenientes': ['', Validators.required],
      'orden': [true],
      'comentario': [''],
      'quejas': ['', Validators.required],
      'foto1': [''],
      'foto2': [''],
      'foto3': [''],
      'uid_cliente': [''],
      'uid_pedido': ['']
    });

    this.pedidosService.obtenerTodosLosPedidos().then( (resp) => {
      let flag = false;
      resp.forEach((item:any) => {
        if(item.usuario.email == this.auth.currentUser?.email && item.estado != 'FINALIZADO' ){
          if(!(item as Object).hasOwnProperty('encuesta')){
            this.idPedido = item.id;
          }
        }
      })

      if(flag){
        setTimeout(() => { this.spin = false; }, 2000);
      }else{
        this.presentToast('bottom', 'El cliente ya realizó la encuesta.', "danger", 4000);
        this.router.navigate(['/opciones-cliente']);
        this.spin = false;
      }
    })

    this.usuarioSvc.getListadoUsuarios().then((resp: any) => {
      if (resp.size > 0) {
        resp.forEach((usuario: any) => {
          if (usuario.data().uid == this.auth.currentUser?.uid) {
            this.usuarioUID = usuario.data().uid;
            console.log(this.usuarioUID)
          }
        });
      }
    });

  }

  ngOnInit() { }

  // tomarFotoProducto() {
  //   this.imagesSrv.agregarFoto()
  //   .then((url:any) => {
  //     this.i_NroImagen++;
  //     this.producto.img_src.push(url);
  //     this.presentToast('middle', 'Se procesó con éxito la imagen', "success", 1500);
  //   }
  //   ).catch((err:any) => {
  //     this.presentToast('middle', 'Error al subir imagen: '  + err, "danger", 1500);
  //   })
  //   // this.sacarFoto();
  // }

  SubirFoto1(e: any) {
    this.fotos.append('foto1', e.target.files[0]);
  }
  SubirFoto2(e: any) {
    this.fotos.append('foto2', e.target.files[0]);
  }
  SubirFoto3(e: any) {
    this.fotos.append('foto3', e.target.files[0]);
  }

  EnviarEncuesta() {
    this.spin = true;

    this.form.controls['uid_cliente'].setValue(
      this.usuarioUID
    );

    this.form.controls['uid_pedido'].setValue(
      ' '
    );

    let objeto = {
      comentario: this.form.get('comentario')?.value,
      foto1: this.fotos.get('foto1'),
      foto2: this.fotos.get('foto2'),
      foto3: this.fotos.get('foto3'),
      orden: true,
      inconvenientes: this.form.get('inconvenientes')?.value,
      puntaje: this.form.get('puntaje')?.value,
      quejas: this.form.get('quejas')?.value,
      uid_cliente: this.form.get('uid_cliente')?.value,
      uid_pedido: ''
    }

    console.log(objeto)

    this.encuestasSvc.crearEncuesta(objeto).then(() => {
      //document.getElementById('enviar').setAttribute('disabled', 'disabled');
      this.pedidosService.actualizarEstadoEncuesta(this.idPedido, true)
      setTimeout(() => {
        this.presentToast('bottom', 'Se registró la encuesta correctamente.', "success", 1500);
        //this.encuestasSvc.encuesta = true;
        this.spin = false;
        this.router.navigate(['/home/principal']);
      }, 2000);

    }).catch((error: any) => {
      this.presentToast('bottom', 'Ocurrió un error al registrar la encuesta.', "error", 1500);
      this.spin = false;
    });
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duration,
      position: position,
      color: color
    });
    await toast.present();
  }

}
