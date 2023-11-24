export class Mesa {
    numero:string;
    cantidadComensales:number;
    tipo:string;
    img_src:string;
    ocupada: boolean;
  
    constructor(){
        this.numero = "0";
        this.cantidadComensales = 0;
        this.tipo = '';
        this.img_src = '';
        this.ocupada = false;
    }
  }
  
  export enum eTipoMesa{
    VIP,
    discapacitados,
    estandar,
    cumpleaños
  }
  