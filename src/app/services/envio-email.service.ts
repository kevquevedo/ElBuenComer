import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { init } from "@emailjs/browser";
init("vax0fhfDlmBzBYgY7");


@Injectable({
  providedIn: 'root'
})
export class EnvioEmailService {

  constructor() { }

  enviarEmail(nombreUsuario:string, mailUsuario:string, mensaje: string){
    let templateParams = {
      to_name: nombreUsuario,
      message: mensaje,
      mailUsuario: mailUsuario,
      from_name: "El Buen Comer App - Notificaciones"
    };

    emailjs.send("service_z1yzsmw", "template_kldedez", templateParams)
      .then(res =>{
        console.log("Email enviado.", res.status, res.text);
      })
      .catch(error =>{
        console.log("Error al enviar el email.", error);
      });

  }


}

