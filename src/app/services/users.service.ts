import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ImagesService } from './images.service';
import { Usuario } from '../Pages/alta-clientes/alta-clientes.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usuariosRef: AngularFirestoreCollection;
  private usuariosCollection!: AngularFirestoreCollection<any>;

  constructor(
    private db: AngularFirestore,
    private imagenes:ImagesService) {
    this.usuariosRef = this.db.collection('usuarios');
  }

  public crearUsuario(usuario: Usuario) {
    return this.usuariosRef.add({ ...usuario }).then((data) => {
      this.update(data.id, { uid: data.id });
        
      //var anonimo = usuario.email == null ? true : false;
      localStorage.removeItem('usuario_ARBULU');
      localStorage.setItem('usuario_ARBULU', JSON.stringify(
        {
          'uid': data.id,
          'email': usuario.email,
          'sesion': 'activa',
          'tipo': usuario.tipo,
          'tipoEmpleado': usuario.tipoEmpleado
        }));

        return data.id
    });
  }

  
  public update(id: string, data: any) {
    return this.usuariosRef.doc(id).update(data);
  }

  setItemWithId(item: any, id:string) {
    this.usuariosCollection = this.db.collection('usuarios');
    return this.usuariosCollection.doc(id).set(Object.assign({}, item));    
  }

}
