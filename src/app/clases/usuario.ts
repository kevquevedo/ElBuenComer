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
  clienteValidado: string;
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
    this.clienteValidado = '';
    this.token='';
    this.tipo='';
    this.tipoEmpleado='';
  }
}

export enum eUsuario{
  dueño='dueño',
  supervisor='supervisor',
  empleado='empleado',
  cliente='cliente',
  }
  
  export enum eEmpleado{
  metre='metre',
  mozo='mozo',
  cocinero='cocinero',
  bartender='bartender'
  }
