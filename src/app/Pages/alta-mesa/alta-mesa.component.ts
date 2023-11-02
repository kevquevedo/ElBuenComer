import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Mesa } from 'src/app/clases/mesa';
import { AuthService } from 'src/app/services/auth.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent  implements OnInit {

  public mesa!: Mesa;
  public currentUser: any; //Datos de la sesion
  public mesasList!: Mesa[]; //Toda las mesas que existen.
  public formMesa!: FormGroup;
  //public imagenPerfil = "../../../assets/plato.png";
  public errorImagen!: boolean;
  public uploadProgress!: number;
  public habilitarFotosBTN = false;
  spin!: boolean;
  fotoMesa = false;

  constructor(private fb: FormBuilder,
    private route: Router, 
    public mesaSrv: MesaService,
    private loadingController: LoadingController, 
   //public navCtrl: NavController,
    private imagesSrv:ImagenesService,
    private toastr: ToastController,
   // private spinner: NgxSpinnerService
    ) {

  }

  navigateBack(){
   // this.navCtrl.back();
  }
  ngOnInit() {
    this.mesa = new Mesa();
    //this.mesa.img_src = new Array();
    //  this.validarAltaProducto(this.formProducto);
    this.formMesa = this.fb.group({
     // 'numero': ['', [Validators.required]],
      'cantidadComensales': ['', [Validators.required]],
      'tipo': ['', [Validators.required]]
    }); 
    setTimeout( ()=>{ this.spin = false; }, 2500)

    
  }
  // numero:number;
  // cantidadComensales:number;
  // tipo:string;
  // img_src:string;
  // ocupada: boolean;
  // uid: string;



 
  GuardarNuevoMesa() {
    this.spin = true;
    
    //this.mesa.numero = this.formMesa.get('numero')?.value;
    this.mesa.cantidadComensales = this.formMesa.get('cantidadComensales')?.value;
    this.mesa.tipo = this.formMesa.get('tipo')?.value;

    // if (!this.validarCantidadFotos()) {
      alert("validacion img");
      this.errorImagen = false;
      try{
        this.mesaSrv.crearMesa(this.mesa);
        alert("creacion exitosa");
        this.presentToast('middle', 'La creación fue exitosa', "success", 1500);
        // La creación fue exitosa
        this.spin = false;
      }
      catch(error:any)
      {
        alert("creacion erronea");
        this.spin = false;
        // Hubo un error en la creación
        this.presentToast('middle', 'Error en la creación. ' + error, "error", 1500);
      }
      

      //console.log("Nueva producto a guardar: " + this.mesa.numero + " " + this.mesa.img_src);
    // } else {
    //   alert("FALTAN LAS FOTOS");
    //   //mostrar el error de las imagenes
    //   this.errorImagen = true;
    //   console.log("FALTAN LAS FOTOS");
    //   this.presentToast('middle', 'Faltan agregar imagenes', "error", 1500);
    // }
    

  }

  tomarFotoMesa() {
    this.imagesSrv.agregarFoto()
    .then((url:any) => {
      this.mesa.img_src = url;
      this.fotoMesa = true;
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

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color:string, duration: number) {
    const toast = await this.toastr.create({
      message: mensaje,
      duration: duration,
      position: position,
      color: color
    });
    await toast.present();
  }


}

