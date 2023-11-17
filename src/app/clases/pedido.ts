export class Pedido {
}

 
export enum eEstadoPedido{
    PENDIENTE= 'PENDIENTE',
     CONFIRMADO='CONFIRMADO',
     EN_ELABORACION= 'EN_ELABORACION',
     TERMINADO='TERMINADO',
     ENTREGADO='ENTREGADO' ,
     RECIBIDO='RECIBIDO',
     CUENTA='CUENTA',
     PAGADO='PAGADO' ,
     COBRADO='COBRADO',
     FINALIZADO='FINALIZADO'
  }
  export enum eEstadoProductoPedido{
     PENDIENTE= 'PENDIENTE',
    EN_ELABORACION= 'EN_ELABORACION',
    TERMINADO='TERMINADO' 
  }
  
  export interface productoPedido{ 
    cantidad:number;
    descripcion: string;
    doc_id:string;
    estadoProductoPedido:eEstadoProductoPedido;
    img_src: string;
    precio: number;
    nombre: string;
    sector: string; 
    selected:boolean;   
    tiempo_elaboracion: number;
  }
