import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private firestore:Firestore,
  ) { }

  crearUsuario( usuario: Usuario ){
    let usuariosRef = collection(this.firestore, 'usuarios');
    addDoc(usuariosRef, usuario)
  }
}
