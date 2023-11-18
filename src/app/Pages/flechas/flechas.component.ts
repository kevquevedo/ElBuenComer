import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Puntos } from 'src/app/clases/puntos';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-flechas',
  templateUrl: './flechas.component.html',
  styleUrls: ['./flechas.component.scss'],
})
export class FlechasComponent  implements OnInit {

  imagenes = [
    { src: '../../../assets/flechas/arriba.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba1.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo1.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha1.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda1.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba2.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo2.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha2.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda2.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba3.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo3.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha3.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda3.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba4.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo4.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha4.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda4.jpg', direccion: "izquierda" },
    { src: '../../../assets/flechas/arriba5.jpg', direccion: "arriba" },
    { src: '../../../assets/flechas/abajo5.jpg', direccion: "abajo" },
    { src: '../../../assets/flechas/derecha5.jpg', direccion: "derecha" },
    { src: '../../../assets/flechas/izquierda5.jpg', direccion: "izquierda" },
  ];

  currentImage: any = "";
  puntaje: number = 0;
  empezado: boolean = false;
  timeLeft: number = 60;
  interval: any;
  tiempoTerminado: boolean = false;
  listaPuntajes: Array<Puntos> = new Array<Puntos>();
  listaOrdenada: Array<Puntos> = new Array<Puntos>();
  usuario: Usuario = new Usuario();
 // public usuario$: Observable<any> = this.authService.afAuth.user;
  pedidos: any = [];
  pedido: any;
  usuarioActual:any;
  spin = false;
  utilidades: any;
  toastr: any;

  constructor(public router: Router, 
    public authService: AuthService, 
    private usuarioSvc: UsuariosService,
    private pedidoSvc: PedidosService, 
   // private spinner:NgxSpinnerService,
   // private utilidades:UtilidadesService,
    //private firestoreSvc:FirestoreService
    private auth: Auth
    ) {
   
  }

  ngOnInit(): void {

  }

  ionViewDidEnter(){
    
     this.usuarioSvc.getListadoUsuarios().then((resp: any) => {
      if (resp.size > 0) {
        resp.forEach((usuario: any) => {
          if (usuario.data().email == this.auth.currentUser?.email) {
            this.usuarioActual = usuario.data();
            //OBTENER PEDIDO DE USUARIO Y REVISAR QUE NO ESTE FINALIZADO PARA PERMITIR AHCER ENCUESTA
            this.pedidoSvc.obtenerPedidoPorIdUsuario(this.usuarioActual.id).then(res => {
              this.pedido = res;
            });

          }
        });
        this.spin = false;
      }
    });

 
  }
  empezar() {
    this.currentImage = this.updateRandomImage();
    this.empezado = true;
    this.tiempoTerminado = false;
    this.puntaje = 0;
    this.startTimer();
  }

  updateRandomImage() {
    const i = Math.floor(Math.random() * (this.imagenes.length - 1)) + 0;
    return this.imagenes[i];
  }

  getImage() {
    return this.currentImage.src;
  }

  onArriba() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("arriba")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }

  onAbajo() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("abajo")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }

  onIzquierda() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("izquierda")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }

  onDerecha() {
    console.log(this.currentImage.direccion);
    if (this.currentImage.direccion.includes("derecha")) {
      this.puntaje += 10;
      this.currentImage = this.updateRandomImage();
    }
    else {
      this.puntaje -= 5;
      this.currentImage = this.updateRandomImage();
    }
  }



  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
        this.tiempoTerminado = true;
        this.empezado = false;
        console.log(this.puntaje);
        this.pedido.jugado = true;
        this.pedido.descuento = this.puntaje < 500 ? 0 : 20;
        this.updatePedidoPuntaje();
        
        if (this.tiempoTerminado) {
          this.pauseTimer();
          //this.router.navigate(['principal']);
        }

      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  updatePedidoPuntaje() {
    this.spin = true;
    this.pedido.jugado = true;
    
    this.pedidoSvc.updateEstadoPedido(this.pedido);
      if(this.pedido.descuento == 0)
      {
        this.presentToast('middle', 'Felicitaciones, ha logrado un 20% de descuento!', "success", 2000);
      }
      else{
        this.presentToast('middle', 'No ha logrado el descuento, mejor suerte la proxima!', "error", 2000);
      }
      setTimeout(()=>{
        this.router.navigate(['principal']);
        this.spin = false;
        console.log("Pedido actualizado, jugado en true, descuento y juegoJugado en flechas");
      },4000);

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
