export class Usuario {
  email: string;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: number;
  foto: string;
  uid?: string;
  tipo: string;
  tipoEmpleado: string;
  enListaDeEspera: boolean;
  mesa: string;
  clienteValidado: boolean;
  token:string;
  constructor(){
    this.email= '';
    this.nombre= '';
    this.apellido= '';
    this.dni= 0;
    this.cuil= 0;
    this.foto= '';
    this.uid= '';
    this.enListaDeEspera = false;
    this.mesa = '';
    this.clienteValidado = false;
    this.token='';
    this.tipo='';
    this.tipoEmpleado='';
  }
}
