import { Injectable } from '@angular/core';
import { Producto } from '../clases/producto';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  items!: Observable<any[]>; 
  public dbRef: AngularFirestoreCollection<any>;
  constructor(
    public afStore: AngularFirestore 
  ) {
    this.dbRef = this.afStore.collection("productos");
  }

    TraerProductos(): Observable<any>{
      return this.dbRef.valueChanges({idField: "doc_id"});
    }

    GuardarNuevoProducto(nuevaProd: Producto): any{
      return this.dbRef.add(Object.assign({},nuevaProd));
    }

    CambiarEstadoProducto(doc_id:string, productos:any){
      this.afStore.doc(`mesaCliente/${doc_id}`).update({productos: productos })
    }

    async  EliminarProducto(id_doc:any):Promise<boolean>{
      
      this.dbRef.doc(id_doc).delete().then(() =>{
            return true;
          });
          return false;
    }

    async ActualizarProducto(producto:Producto, id_doc:any){
        this.afStore.doc(`productos/${id_doc}`).update({
          nombre: producto.nombre,
          img_src: producto.img_src,
          descripcion: producto.descripcion,
          sector: producto.sector,
          precio: producto.precio,
          tiempo_elaboracion : producto.tiempo_elaboracion
        }); 
    } 
    setItemWithId(item: any, id:string) {
      return this.dbRef.doc(id).set(Object.assign({}, item));    
    }
}
