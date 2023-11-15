import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, getDocs, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
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

  actualizarEstadoCliente(usuario: any, estado:string){
    let usuariosRef = doc(this.firestore, 'usuarios', usuario.id);
    updateDoc(usuariosRef, {
      clienteValidado: estado
    });
  }

  UpdateListadoEspera(id:string): Promise<void> {
    return new Promise((resolve, reject) => {
      const usuario = doc(this.allUsuarios, id);
      updateDoc(usuario, {
        enListaDeEspera : true,
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
        .catch((error) => {
          reject(error); // Se rechaza la promesa si ocurre un error durante la operación
        });
    });
  }

  UpdateMesaCliente(id:string, mesa:any): Promise<void> {
    return new Promise((resolve, reject) => {
      const usuario = doc(this.allUsuarios, id);
      updateDoc(usuario, {
        enListaDeEspera : false,
        mesa: mesa,
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
        .catch((error) => {
          reject(error); // Se rechaza la promesa si ocurre un error durante la operación
        });
    });
  }



}
