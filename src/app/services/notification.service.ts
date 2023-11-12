import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotification, PushNotificationSchema, PushNotificationToken, PushNotifications, Token } from '@capacitor/push-notifications';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  //admin = require('firebase-admin');
  projectId = 'elbuencomer.app';
  url = `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`;


  constructor(
    private firestore: Firestore,
    private router: Router,
    private http: HttpClient) { }


  async initializePushNotifications(idusuario: any) {
    PushNotifications.requestPermissions().then((result: any) => {
      if (result.granted) {
        PushNotifications.register();
      } else {
        // Permiso no otorgado, maneja el escenario según lo necesario
      }
    });

    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token de registro:', JSON.stringify(token));
      const aux = doc(this.firestore, `usuarios/${idusuario}`);
      await updateDoc(aux, {
        token: token.value
      })
    });

    // PushNotifications.addListener('registration', (token: PushNotificationToken) => {
    //   console.log('Token de registro:', JSON.stringify(token));
    // });

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

    // });

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

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
        if(notificationAction.notification.extra.data.pedido_id!= null){
          this.router.navigate([notificationAction.notification.extra.data.ruta,
             { pedido_id: notificationAction.notification.extra.data.pedido_id }]);
        }
        this.router.navigateByUrl(notificationAction.notification.extra.data.ruta)


      }
    );
  }


  sendPushNotification(req:any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer f74e981e486fd8717cacbe25237757269dba2dc6`,
      'Content-Type': 'application/json'
    });
    let message = {
      "message": {
        "token": "f74e981e486fd8717cacbe25237757269dba2dc6",
        "notification": {
          "title": "Título de la Notificación",
          "body": "Cuerpo del Mensaje"
        }
      }
    };

    return this.http.post<any>(this.url, message, {  headers } );


  }






}
