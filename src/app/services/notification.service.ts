import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotification, PushNotificationSchema, PushNotificationToken, PushNotifications, Token } from '@capacitor/push-notifications';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuariosService } from './usuarios.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  //admin = require('firebase-admin');
  projectId = 'elbuencomer.app';
  url = `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`;
  pushNotificationToken: any;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private http: HttpClient,
    private uSvc: UsuariosService) {
        this.initializePushNotifications();
     }


  async initializePushNotifications() {
    PushNotifications.requestPermissions().then((result: any) => {
      if (result.granted) {
        //alert(result.granted);
        console.log("TOKEN:" );
        PushNotifications.register();
        //this.uSvc.actualizarToken(idusuario, token);
      } else {
        // Permiso no otorgado, maneja el escenario según lo necesario
      }
    });

    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token de registro:', JSON.stringify(token));
      //alert("TOKEN " + token.value);
      this.pushNotificationToken = JSON.stringify(token.value);
      //alert("TOKEN " + this.pushNotificationToken);
      localStorage.setItem("deviceToken", JSON.stringify(this.pushNotificationToken));
      //this.uSvc.actualizarToken(id, this.pushNotificationToken);
    });
    PushNotifications.register();

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      // Procesa la notificación aquí
      console.log('Notificación recibida', JSON.stringify(notification));
      LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || '',
            body: notification.body || '',
            id: new Date().getMilliseconds(),
            extra: {
              data: notification.data
            },
          },
        ],
      });

    });

    // PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
    //   // Procesa la notificación aquí
    //   console.log('Notificación recibida', JSON.stringify(notification));


    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) =>{
        if(notification.notification.data.pedido_id!= null){
          this.router.navigate([notification.notification.data.ruta,
             { pedido_id: notification.notification.data.pedido_id }]);
        }
        this.router.navigateByUrl(notification.notification.data.ruta)
      }
    );

    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        const ruta = notificationAction.notification.extra.data.ruta;
    
        if (ruta) {
          this.router.navigate([ruta]);
        }
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      const ruta = notification.notification.data.ruta;
    
      if (ruta) {
        this.router.navigate([ruta]);
      }
    });
    //     this.router.navigateByUrl(notificationAction.notification.extra.data.ruta)


    //   }
    // );
  }


  sendPushNotification(token:any, ruta:any, title:any, body:any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1GbzKqCPWS5hm\nItAI2FvaeBr7ww/M38nMYJVy62AEGQRhPFkOqXjBhaiqzVW88GEdr/9Syl7jKoc9\nZvh0OjO/xsU4v018JEYB8chduxlbUOmM42cjfexSdnIe4YwNr6oYcb8EJa5TQ32s+ze65qlMgSWfCPutCb/5lCb4USeep/51762/33YiqwB+5KUhe58b8cqFRpFO0j/R\n6zt02GHxAHgzl071HbilEzUDTXtStAEUaGo1x0GeoyIVmDw8rcRvh2x7jRIVMi8o\nxguzHJYA+GF+ezj2nhDdsbGX1HNqnW/TA6TceeNIz0VzBWkdfN5uRDVF7XLv6zu7\n2ARKU1axAgMBAAECggEALsLYhpNnvXuDfEvc34vOG9kLTpqNR9844fbGYAf6oNQ8\n10aX0DteHMoARSoDy2deDCZXjO8IFSv0A5zE5m3o0snmPsLWpQlQskvV6q3W3EdG\nJsTI6tcm4BwJV4Pxf88t4mXsZou8OW+h0bqEJ1RLvp9SMYBGS+XKlgz1CwUZb9ON\nIIOmhNEz3HdwhYsVKb7LKLJvBz9LM88fdyfNpWlggLwbr5t7yescdVLSDm4nBKTM\nKkJQBVxCIA4mwzvWOdwWvoIrtFjRo3HoHpvEMP3Iu4wwdUuKkYG3W5CRD1ESWoZg\nrqQ9t7wNXSnhcVOZgqZrZWunNfrNY5M2BYpElV44yQKBgQDtHpU4fFEN94s9Ab9S\n6gOSaDl2KbxUxnrmIZhmMyt9fLiQnU6UE9qAPxFtfzUqztwjrwkw087ftyVfdpMT\nEoxROZIxWUDgptxi4th9V0t2MP5CckJMm+GB+vH1SuMB5XmdMmEsQbDm6781P7c+\nhOUxoXywS++ui5mCmugF814SMwKBgQDDhUVailSTl2wtMKnVdOulWoe2JrzRh224\nieDvgDMzwTa+K5UEBNSgkJ507VqlIVx3eeis0Oqfn2qI9i4TYm7lwLNExyg/pcWa\nKSAh/6+x7lcwqjD/hWyTxJWb7YrhBXJR7mj6dzy6/bxs25N4p2tRfQHnpf/GDN5z\nvTzvEM+3iwKBgQCa5BFhloNz9jH0JgIObWLr7j0q3NRzJDv/vA5LJD3SePgvLzK3\nM8jVYV1HA4N9dScEAECmrpVCOeal11T3bnROUqcWqVDh7t2jkr8MEUvv5s0QJob8\neA700zHeo45qHLY2Y0RqnnaqQXDjnb1bj4APzYcfulrUz8f1Mq9Bw9m9VQKBgGpl\nSGNHqVSTbuN8er7UnDLj+7vMgq2Gg9eK+CN8YOCGANMlhjakpkwlxoSccNoxOE8v\nwMTh/vsT1fZn+JTF2NEftq3zrlxMSiZkwL6fk61ApKOvyXAS3A3hSQSMFCn1O8uH\n8Apz/lFHKFUYe7yJZmX2n6W9+Fx+vkK/NLxnKpGXAoGAQwos4iDQUimaIVJAiVoM\n8tvkvPI/s2GEcEE29ix8RFxuxGsz5DOzDfnwv/vgvXOgVFgyGs5YhnBzdldf15bt\ndCGud8wEEPal0r/vP0XTprhe3YaO+pzY0n1NefhQKMN6kg6y3Y35wU5JDPdkvNH7\n125qY+ftvoW9jcS0JCLTq8Q=`,
      'Content-Type': 'application/json'
    });
    let message = {
      "message": {
        "token": token,
        "notification": {
          "title": title,
          "body": body
        }
      },
      data: {
        ruta: ruta
      }
    };

    return this.http.post<any>(this.url, message, { headers} ).subscribe(
      (respuesta) => {
        alert('Notificación enviada con éxito:' + respuesta);
      },
      (error) => {
        alert('Error al enviar la notificación:' + error);
      }
    );
    
  }


  
  //   return this.http.post<any>(this.url, message, {  headers } );


  // }






}
