import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ProductosService } from 'src/app/services/productos.service';

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
  spin!: boolean;

  constructor(private fb: FormBuilder,
    private route: Router, 
    public prodSrv: ProductosService,
    private loadingController: LoadingController, 
    public navCtrl: NavController,
    private imagesSrv:ImagenesService,
    private toastr: ToastController,
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
      'precio': ['', [Validators.required]],
      'sector': ['', [Validators.required]],
    }); 
    setTimeout( ()=>{ this.spin = false; }, 2500)

    
  }

  private validarCantidadFotos(): boolean {
    this.errorImagen = (this.i_NroImagen == 3) ? false : true;
    return this.errorImagen;
  }
 
  GuardarNuevoProducto() {
    this.spin = true;
    
    this.producto.nombre = this.formProducto.get('nombre')?.value;
    this.producto.descripcion = this.formProducto.get('descripcion')?.value;
    this.producto.tiempo_elaboracion = this.formProducto.get('tiempo')?.value;
    this.producto.precio = this.formProducto.get('precio')?.value; 
    this.producto.sector = this.formProducto.get('sector')?.value; 
    alert(
      "prod: " +
      this.producto.nombre + " " +
      this.producto.descripcion + " " +
      this.producto.tiempo_elaboracion + " " +
      this.producto.precio + " " +
      this.producto.sector
    );
    if (!this.validarCantidadFotos()) {
      alert("validacion img");
      this.errorImagen = false;
      try{
        this.prodSrv.crearProducto(this.producto);
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
      

      console.log("Nuevo producto a guardar: " + this.producto.nombre + " " + this.producto.img_src);
    } else {
      alert("FALTAN LAS FOTOS");
      //mostrar el error de las imagenes
      this.errorImagen = true;
      console.log("FALTAN LAS FOTOS");
      this.presentToast('middle', 'Faltan agregar imagenes', "error", 1500);
    }
    

  }

  tomarFotoProducto() {
    this.imagesSrv.agregarFoto()
    .then((url:any) => {
      this.i_NroImagen++;
      this.producto.img_src.push(url);
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

export class Productos{
  nombre!: string;
  descripcion!: string;
  tiempo_elaboracion!: number;
  precio!: number;
  img_src!: string[];
  sector!: string; 
}
