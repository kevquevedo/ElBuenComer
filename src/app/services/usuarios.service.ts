import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, getDocs, orderBy, query, setDoc } from '@angular/fire/firestore';
import { Usuario } from '../clases/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  allUsuarios: CollectionReference<DocumentData> = collection(this.firestore, 'usuarios');
  usuarios!: Observable<any[]>;
  constructor(
    private firestore:Firestore,
  ) {
    this.usuarios = collectionData(this.allUsuarios);

  }

  crearUsuario( usuario: Usuario ) :Promise<void>{
    return new Promise((resolve, reject) => {
      const usuarios = doc(this.allUsuarios);
      setDoc(usuarios, {
        id: usuarios.id,
      ...usuario // Spread operator para agregar las propiedadesrepartidor al objeto
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
        .catch((error) => {
          alert(error);
          reject(error); // Se rechaza la promesa si ocurre un error durante la operación
        });
    });
  }

  getListadoUsuarios(){
    const usuarios = collection(this.firestore, 'usuarios');
    return getDocs(usuarios);
  }
}
