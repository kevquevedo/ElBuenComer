import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  altaClientes(){
    this.router.navigate(['alta-clientes']);
  }
  altaProductos(){
    this.router.navigate(['alta-productos']);
  }

  altaMesa(){
    this.router.navigate(['alta-mesa']);
  }

  irAltaDuenoSupervisor(){
    this.router.navigateByUrl('alta-dueno-supervisor')
  }
  irAltaEmpleado(){
    this.router.navigateByUrl('alta-empleado')
  }
}
