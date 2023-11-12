import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private platform: Platform,
    private firestore: Firestore,
    private http: HttpClient,
    private router: Router
  ) {
    this.inicializar();
  }

  inicializar() : boolean {
    let retorno = false;
    if(this.platform.is("mobile")){
      PushNotifications.requestPermissions().then(result => {
        console.log(PushNotifications.requestPermissions())
        if (result.receive === 'granted') {
          PushNotifications.register();
          this.addListeners();
          retorno = true;
        }
      });
    }
    return retorno;
  }


  addListeners(){

    PushNotifications.addListener('registration', (token: Token) => {
      alert('Push registration success, token: ' + token.value);
      //AGREGAR EL TOKEN EN EL USUARIO
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Registration error: ', error.error);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {

        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });

      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        if(notification.notification.data.pedido_id!= null){
          this.router.navigate([notification.notification.data.ruta,
          { pedido_id: notification.notification.data.pedido_id }]);
        }
        this.router.navigateByUrl(notification.notification.data.ruta)
      },
    );
  }

  enviarPushNotification(){

    // return this.http.post<any>(environment.fcmURl, message, {
    //   headers: {
    //     Authorization: `key=${environment.fcmServerKey}`,
    //     'Content-Type': 'application/json',
    //   }
    // } );

  }


}
