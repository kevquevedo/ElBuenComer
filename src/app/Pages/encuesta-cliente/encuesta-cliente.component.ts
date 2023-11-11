import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

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

  constructor(private router: Router,
    //public firestore: FirestoreService,
    private fb: FormBuilder,
    //private utilidades:UtilidadesService,
    //private spinner: NgxSpinnerService,
    //private pedidoSrv:PedidosService,
    private encuestasSvc: EncuestaService,
    private usuarioSvc: UsuariosService,
    private auth: Auth,
    //private firestoreSvc:FirestoreService,
  ) {
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


    // this.usuarioActual = JSON.parse(localStorage.getItem('usuario_ARBULU'));
    this.usuarioSvc.getListadoUsuarios().then((resp: any) => {
      if (resp.size > 0) {
        resp.forEach((usuario: any) => {
          if (usuario.data().uid == this.auth.currentUser?.uid) {
            //OBTENER PEDIDO DE USUARIO Y REVISAR QUE NO ESTE FINALIZADO PARA PERMITIR AHCER ENCUESTA

          }
        });
        this.spin = false;
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
    //this.usuarioActual.uid
    //this.pedido.doc_id
    this.form.controls['uid_cliente'].setValue(
      this.usuarioActual.uid
    );

    this.form.controls['uid_pedido'].setValue(
      this.pedido.doc_id
    );

    this.encuestasSvc.crearEncuesta(this.form).then(() => {
      //document.getElementById('enviar').setAttribute('disabled', 'disabled');

      setTimeout(() => {
        this.presentToast('middle', 'Se registró la encuesta correctamente.', "success", 1500);
        //this.encuestasSvc.encuesta = true;
        this.spin = false;
        this.router.navigate(['/home-cliente']);
      }, 2000);

    }).catch((error: any) => {
      this.presentToast('middle', 'Ocurrió un error al registrar la encuesta.', "error", 1500);
      this.spin = false;
    });
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: string, color: string, duration: number) {
    const toast = await this.toastr.create({
      message: mensaje,
      duration: duration,
      position: position,
      color: color
    });
    await toast.present();
  }

}
