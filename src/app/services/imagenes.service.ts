import { Injectable } from '@angular/core';
import { Camera, CameraResultType, Photo, CameraSource } from '@capacitor/camera';
import { Observable } from 'rxjs';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  items!: Observable<any[]>;


  constructor(
    private storage: Storage,
   //private storage: AngularFireStorage,
   //private afStore: AngularFirestore
  ) { }


  saveFile(file: any, filePath: string){
    //return this.storage.upload(filePath, file);
  }

  getRef(path:string){
    //return this.storage.ref(path).getDownloadURL()
  }

  public async sacarFoto(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    return capturedPhoto;
  }

  public async agregarFoto(): Promise<any>{
    return new Promise(async (exito)=>{
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 50
      });
      var nombreArchivo = this.getRandomArbitrary(0,9999999);
      const file: any = this.base64ToImage(capturedPhoto.dataUrl!);
      console.log(file)
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

  // saveDoc(data: any ) {
  //   let dbRef: AngularFirestoreCollection<any>;
  //   //dbRef = this.afStore.collection("imagenes_usuarios");
  //   //return dbRef.add(Object.assign({}, data));
  // }

  // getImagenes(tipo: string): Observable<any> {
  //   let dbRef: AngularFirestoreCollection<any>;
  //   //dbRef =  this.afStore.collection('imagenes_usuarios', ref => ref.where('tipo', '==', tipo).orderBy('fullDate',"desc"));
  //   //return dbRef.valueChanges({ idField: "doc_id" });
  // }

  // getImagenesByUser(usuario_email:string){
  //   let dbRef: AngularFirestoreCollection<any>;
  //   dbRef = this.afStore.collection("imagenes_usuarios", ref=> ref.where('usuario',"==",usuario_email).orderBy('fullDate',  "desc"  ));
  //   return dbRef.valueChanges({ idField: "doc_id" });
  // }
}
