import { Injectable } from '@angular/core';
import { Camera, CameraResultType, Photo, CameraSource } from '@capacitor/camera';
import { Observable } from 'rxjs';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(
    private storage: Storage,
  ) { }

  public async agregarFoto(): Promise<any>{
    return new Promise(async (exito)=>{
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 50
      });
      var nombreArchivo = this.getRandomArbitrary(0,9999999);
      const file: any = this.base64ToImage(capturedPhoto.dataUrl!);
      let imgRef = ref(this.storage, `${nombreArchivo}`);
      uploadBytes(imgRef, file).then( ()=> {
        getDownloadURL(imgRef).then( url => {
          exito(url)
        })
      })
    })
  }

  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  base64ToImage(dataURI: string) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

}
