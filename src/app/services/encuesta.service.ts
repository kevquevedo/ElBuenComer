import { Injectable } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, collection, Firestore, doc, setDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  allEncuestaClientes: CollectionReference<DocumentData> = collection(this.firestore, 'encuesta-clientes');
  encuestaClientes!: Observable<any[]>;

  constructor(
    private firestore: Firestore,
  ) { 
      this.encuestaClientes = collectionData(this.allEncuestaClientes);
  }


  crearEncuesta(encuesta: any) :Promise<void>{
    return new Promise((resolve, reject) => {
      const productos = doc(this.allEncuestaClientes);
      setDoc(productos, {
        id: productos.id,
      ...encuesta // Spread operator para agregar las propiedadesrepartidor al objeto
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
        .catch((error) => {
          reject(error); // Se rechaza la promesa si ocurre un error durante la operación
        });
    });
  }


  async obtenerEncuestasClientes() {
    const encuestasRef = collection(this.firestore, 'encuesta-clientes');
    const querySnapshot = await getDocs(encuestasRef);
  
    const encuestas:any = [];
    querySnapshot.forEach((doc) => {
      encuestas.push({ id: doc.id, ...doc.data() });
    });
  
    return encuestas;
  }




}
