import { Injectable } from '@angular/core'; 
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, Photo, CameraSource } from '@capacitor/camera';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  items!: Observable<any[]>;
  
   constructor(
    private storage: AngularFireStorage,
    private afStore: AngularFirestore) { } 
    

  saveFile(file: any, filePath: string) {
   return this.storage.upload(filePath, file);
  }

  getRef(path:string)
  {
    return this.storage.ref(path).getDownloadURL()
  }

  public async addNewToGallery(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    return capturedPhoto;
  }


  saveDoc(data: any ) {
    let dbRef: AngularFirestoreCollection<any>;
      dbRef = this.afStore.collection("imagenes_usuarios");
      return dbRef.add(Object.assign({}, data));
  } 


  getImagenes(tipo: string): Observable<any> {

    let dbRef: AngularFirestoreCollection<any>; 
    dbRef =  this.afStore.collection('imagenes_usuarios', 
                                      ref => ref.where('tipo', '==', tipo)
                                                .orderBy('fullDate',  "desc"  )
                                    ); 
      return dbRef.valueChanges({ idField: "doc_id" }); 
  }

 

  getImagenesByUser(usuario_email:string){
    let dbRef: AngularFirestoreCollection<any>; 
      dbRef = this.afStore.collection("imagenes_usuarios", 
                                      ref=> ref.where('usuario',"==",usuario_email)
                                               .orderBy('fullDate',  "desc"  ));
      return dbRef.valueChanges({ idField: "doc_id" }); 
  }

}
