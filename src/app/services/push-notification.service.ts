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
import { Auth } from '@angular/fire/auth';
import { UsuariosService } from './usuarios.service';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private platform: Platform,
    private firestore: Firestore,
    private http: HttpClient,
    private router: Router,
    private auth: Auth,
    private usuarioService: UsuariosService
  ) {
    this.inicializar();
  }

  inicializar() : boolean {
    let retorno = false;

      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();
          this.addListeners();
          retorno = true;
        }
      });

    return retorno;
  }


  async addListeners(){

    PushNotifications.addListener('registration', (token: Token) => {
      this.usuarioService.actualizarToken(token.value, this.auth.currentUser?.email!);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Registration error: ', error.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {

        console.log(notification.data);
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

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {

        this.router.navigateByUrl(notification.notification.data.ruta)
      },
    );

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {

        this.router.navigateByUrl(notificationAction.notification.extra.data.ruta)
      }
    );

  }

  enviarPushNotification(message: any): Observable<any>{
    return this.http.post<any>(environment.fcmURl, message, {
      headers: {
        Authorization: `key=${environment.fcmServerKey}`,
        'Content-Type': 'application/json',
      }
    } );
  }


}
