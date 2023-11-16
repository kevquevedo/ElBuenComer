import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isAdmin: boolean = false;
  isCliente: boolean = false;
  tipoEmpleado: string = "";
  isBartender: boolean = false;
  isCocinero: boolean = false;
  isMozo: boolean = false;
  isMetre: boolean = false;
  tieneMesa: boolean = false;
  enListaEspera!: boolean;

  constructor(public router: Router, public afAuth: AngularFireAuth, private usuarioService: UsuariosService) { }

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      this.usuarioService.getListadoUsuarios().then(resp => {
        resp.forEach((usuario: any) => {
          if (usuario.data().email == user?.email) {
            if (usuario.data().tipo == "admin") {
              this.isAdmin = true;
            } else if (usuario.data().tipo == "cliente") {
              this.isCliente = true;
              if(usuario.data().mesa != ""){
                this.tieneMesa = true;
              }
              this.enListaEspera = usuario.data().enListaDeEspera;
            } else {
              this.tipoEmpleado = usuario.data().tipoEmpleado;
              if(this.tipoEmpleado == "bartender"){
                this.isBartender = true;
              }else if(this.tipoEmpleado == "cocinero"){
                this.isCocinero = true;
              }else if(this.tipoEmpleado == "metre"){
                this.isMetre = true;
              }else{
                this.isMozo = true;
              }
            }
            console.log(usuario.data());
          }
        }
        );
      }
      );
    })

  }

  irAltaDuenoSupervisor() {
    this.router.navigateByUrl('alta-dueno-supervisor')
  }
  irAltaEmpleado() {
    this.router.navigateByUrl('alta-empleado')
  }
  irARegistrosPendientes(){
    this.router.navigateByUrl('registros-pendientes')
  }
  irAListaEspera(){
    this.router.navigateByUrl('home/listaEspera')
  }
  altaProductos(){
    this.router.navigate(['alta-productos']);
  }
  altaMesa(){
    this.router.navigate(['alta-mesa']);
  }
  irAlChat(){
    this.router.navigateByUrl('chat-mozo')
  }
  logOut() {
    this.afAuth.signOut().then(() => this.router.navigate([""]));
  }
}
