import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-alta-productos',
  templateUrl: './alta-productos.component.html',
  styleUrls: ['./alta-productos.component.scss'],
})
export class AltaProductosComponent  implements OnInit {

  public producto!: Productos;
  public currentUser: any; //Datos de la sesion
  public productosList!: Productos[]; //Toda las mesas que existen.
  public formProducto!: FormGroup;
  public i_NroImagen: number = 0;
  public imagenPerfil = "../../../assets/plato.png";
  public errorImagen!: boolean;
  public uploadProgress!: number;
  public habilitarFotosBTN = false;

  constructor(private fb: FormBuilder,
    private route: Router, 
    //public prodSrv: ProductosService,
    private loadingController: LoadingController, 
    public navCtrl: NavController,
    private imagenSrv:ImagesService,
    //private utilSrv:UtilidadesService,
    private authSrv:AuthService,
   // private spinner: NgxSpinnerService
    ) {

  }

  navigateBack(){
    this.navCtrl.back();
  }
  ngOnInit() {
    this.producto = new Productos();
    this.producto.img_src = new Array();
    //  this.validarAltaProducto(this.formProducto);
    this.formProducto = this.fb.group({
      'nombre': ['', [Validators.required]],
      'descripcion': ['', [Validators.required]],
      'tiempo': ['', [Validators.required]],
      'precio': ['', [Validators.required]] 
    }); 

    //sector
    // if(this.authSrv.getCurrentUserLS().tipoEmpleado == 'cocinero'){
    //   this.producto.sector ='COCINA';
    // }else{
    //   this.producto.sector ='BEBIDA';
    // }
  }

  private validarCantidadFotos(): boolean {
    this.errorImagen = (this.i_NroImagen == 3) ? false : true;
    return this.errorImagen;
  }
 
  GuardarNuevoProducto() {
    //this.spinner.show();
    this.producto.nombre = this.formProducto.get('nombre')?.value;
    this.producto.descripcion = this.formProducto.get('descripcion')?.value;
    this.producto.tiempo_elaboracion = this.formProducto.get('tiempo')?.value;
    this.producto.precio = this.formProducto.get('precio')?.value; 

    // if (!this.validarCantidadFotos()) {
    //   this.errorImagen = false;
      //var resp = this.prodSrv.GuardarNuevoProducto(this.producto)
    //   if (resp) {
    //     console.log("Producto guardado con exito");
       
    //     //exito al guardar
    //  //   this.toastCtrl.presentToast("Se guardo con el exito el producto", 2000,"success")
     
    //  setTimeout(() => {
    //  // this.utilSrv.successToast("Producto guardado con exito");
    //   //this.spinner.hide();
    //   this.route.navigate(['/home-empleado']);
    //  }, 2000);

    //   }
    //   else {
    //     setTimeout(() => {
    //       //this.utilSrv.errorToast("Error al guardar el nuevo producto")
    //       console.log("error al guardar el nuevo producto ");
    //       //this.spinner.hide();
         
    //      }, 2000);

    //   }

    //   console.log("Nuevo producto a guardar: " + this.producto.nombre + " " + this.producto.img_src);
    // } else {
    //   //mostrar el error de las imagenes
    //   this.errorImagen = true;
    //   console.log("FALTAN LAS FOTOS");


    //   setTimeout(() => {
    //     //this.utilSrv.warningToast('Faltan fotos del producto')
    //     console.log("error al guardar el nuevo producto ");
    //     //this.spinner.hide();
       
    //    }, 2000);

    // }

  }

  tomarFotoProducto() {
    if (this.i_NroImagen < 3 ) {
      this.addPhotoToGallery();
    }
  }

  async addPhotoToGallery() {
    const photo = await this.imagenSrv.addNewToGallery();
    //this.spinner.show();
    this.uploadPhoto(photo).then((res)=>{
      
      setTimeout(() => { 
        //this.spinner.hide()
      }, 5000);

    }).catch((err) => {
      console.log("Error addPhotoToGallery", err);
    });
  }
 
  private async uploadPhoto(cameraPhoto: Photo) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();

    const uploadTask = this.imagenSrv.saveFile(blob, filePath);

    console.log("nro actual de fotos cargadas: " + this.i_NroImagen);
    uploadTask.then(async (res:any) => {
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        console.log("URL  CORRECTO- i_IMG++");
        this.producto.img_src.push(downloadURL);

        this.i_NroImagen++;
        console.log("Cntidad fotos cargadas: " + this.i_NroImagen + "\n URL:" + this.producto.img_src);
        console.log(this.producto.img_src);
      } else {
        console.log("IMAGEN NO CORRECTA . NO SE CONTABILIZA " + this.i_NroImagen);
      }
      this.validarCantidadFotos();
    })
      .catch((err:any) => {
        console.log("Error al subbir la imagen: ", err);
      });
  }


  getFilePath() {
    return new Date().getTime() + '-productos';
  }

}

export class Productos{
  nombre!: string;
  descripcion!: string;
  tiempo_elaboracion!: number;
  precio!: number;
  img_src!: string[];
  sector!: string; 
}
