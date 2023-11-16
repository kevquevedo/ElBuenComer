import { Component, OnInit } from '@angular/core';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-chat-mozo',
  templateUrl: './chat-mozo.component.html',
  styleUrls: ['./chat-mozo.component.scss'],
})
export class ChatMozoComponent  implements OnInit {

  spin!: boolean;
  chatMesas!: any;
  modalChat1! : boolean;
  modalChat2! : boolean;
  modalChat3! : boolean;
  modalChat4! : boolean;
  mensaje!: string;
  listadoMensajes1! : any;
  listadoMensajes2! : any;
  listadoMensajes3! : any;
  listadoMensajes4! : any;
  mesaUsuario!: any;
  idMesa! : any;
  mesa1ID!: any;
  mesa2ID!: any;
  mesa3ID!: any;
  mesa4ID!: any;


  constructor(
    private mesaService: MesaService
  ) {
    this.spin = true;
    this.modalChat1 = false;
    this.modalChat2 = false;
    this.modalChat3 = false;
    this.modalChat4 = false;
    this.listadoMensajes1 = [];
    this.listadoMensajes2 = [];
    this.listadoMensajes3 = [];
    this.listadoMensajes4 = [];
    this.mesaUsuario = 0;
    this.idMesa = '';
    this.mesa1ID = '';
    this.mesa2ID = '';
    this.mesa3ID = '';
    this.mesa4ID = '';
  }

  ngOnInit() {

    this.mesaService.obtenerChatsMesas().then( resp => {
      this.chatMesas = [];
      resp.forEach( (chat:any) => {
        this.chatMesas.push(chat.data())
      })
      this.chatMesas.sort(this.ordenarPorNumero)
      setTimeout( ()=>{ this.spin = false; }, 1500)
      this.chatMesas.forEach( (item:any) => {
        if(item.numero == 1){
          this.mesa1ID = item.id;
          this.listadoMensajes1 = item.mensajes;
        }
        if(item.numero == 2){
          this.mesa2ID = item.id;
          this.listadoMensajes2 = item.mensajes;
        }
        if(item.numero == 3){
          this.mesa3ID = item.id;
          this.listadoMensajes3 = item.mensajes;
        }
        if(item.numero == 4){
          this.mesa4ID = item.id;
          this.listadoMensajes4 = item.mensajes;
        }
      })
    })

  }

  ordenarPorNumero(mesa1: any, mesa2: any){
    if(mesa1.numero < mesa2.numero){
      return -1;
    }else if(mesa1.numero > mesa2.numero){
      return 1;
    }
    return 0;
  }

  modalChat1Estado(estado: boolean){
    this.modalChat1 = estado;
    this.mesaUsuario = 1;
    this.idMesa = this.mesa1ID;
  }

  modalChat2Estado(estado: boolean){
    this.modalChat2 = estado;
    this.mesaUsuario = 2;
    this.idMesa = this.mesa2ID;
  }

  modalChat3Estado(estado: boolean){
    this.modalChat3 = estado;
    this.mesaUsuario = 3;
    this.idMesa = this.mesa3ID;
  }

  modalChat4Estado(estado: boolean){
    this.modalChat4 = estado;
    this.mesaUsuario = 4;
    this.idMesa = this.mesa4ID;
  }

  enviarMensaje1(){
    if (this.mensaje != "" && this.mensaje != null){
      let mensajeEnviado = {mensaje: this.mensaje, emisor: 'mozo', mesa: '1'};
      this.listadoMensajes1.push(mensajeEnviado);
      this.mesaService.updateChatsMesas(this.listadoMensajes1, this.idMesa);
      this.mensaje = "";
    }
    setTimeout( ()=>{ this.actualizarChat1(this.mesaUsuario); }, 1000)
  }

  enviarMensaje2(){
    if (this.mensaje != "" && this.mensaje != null){
      let mensajeEnviado = {mensaje: this.mensaje, emisor: 'mozo', mesa: '1'};
      this.listadoMensajes2.push(mensajeEnviado);
      this.mesaService.updateChatsMesas(this.listadoMensajes2, this.idMesa);
      this.mensaje = "";
    }
    setTimeout( ()=>{ this.actualizarChat2(this.mesaUsuario); }, 1000)
  }

  enviarMensaje3(){
    if (this.mensaje != "" && this.mensaje != null){
      let mensajeEnviado = {mensaje: this.mensaje, emisor: 'mozo', mesa: '1'};
      this.listadoMensajes3.push(mensajeEnviado);
      this.mesaService.updateChatsMesas(this.listadoMensajes3, this.idMesa);
      this.mensaje = "";
    }
    setTimeout( ()=>{ this.actualizarChat3(this.mesaUsuario); }, 1000)
  }

  enviarMensaje4(){
    if (this.mensaje != "" && this.mensaje != null){
      let mensajeEnviado = {mensaje: this.mensaje, emisor: 'mozo', mesa: '1'};
      this.listadoMensajes4.push(mensajeEnviado);
      this.mesaService.updateChatsMesas(this.listadoMensajes4, this.idMesa);
      this.mensaje = "";
    }
    setTimeout( ()=>{ this.actualizarChat4(this.mesaUsuario); }, 1000)
  }

  actualizarChat1(numerMesa:number){
    this.mesaService.obtenerChatsMesas().then( resp =>{
      resp.forEach( (mesaChat:any) => {
        if(mesaChat.data().numero == numerMesa){
          this.listadoMensajes1 = mesaChat.data().mensajes;
        }
      })
    })
  }

  actualizarChat2(numerMesa:number){
    this.mesaService.obtenerChatsMesas().then( resp =>{
      resp.forEach( (mesaChat:any) => {
        if(mesaChat.data().numero == numerMesa){
          this.listadoMensajes2 = mesaChat.data().mensajes;
        }
      })
    })
  }

  actualizarChat3(numerMesa:number){
    this.mesaService.obtenerChatsMesas().then( resp =>{
      resp.forEach( (mesaChat:any) => {
        if(mesaChat.data().numero == numerMesa){
          this.listadoMensajes3 = mesaChat.data().mensajes;
        }
      })
    })
  }

  actualizarChat4(numerMesa:number){
    this.mesaService.obtenerChatsMesas().then( resp =>{
      resp.forEach( (mesaChat:any) => {
        if(mesaChat.data().numero == numerMesa){
          this.listadoMensajes4 = mesaChat.data().mensajes;
        }
      })
    })
  }

}
