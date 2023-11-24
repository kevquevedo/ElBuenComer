import { Injectable } from '@angular/core';
import { Producto } from '../clases/producto';
import { Observable } from 'rxjs';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, getDocs, orderBy, query, setDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})

export class ProductosService {

  allProductos: CollectionReference<DocumentData> = collection(this.firestore, 'productos');
  productos!: Observable<any[]>;

  constructor(
    private firestore: Firestore,
  ) {
      this.productos = collectionData(this.allProductos);
  }

  // async crearProducto(producto: Producto) {
  //   try {
  //     const productosRef = collection(this.firestore, 'productos');
  //     const docRef = await doc(this.allProductos);
  //     console.log('Producto creado con ID: ', docRef.id);
  //     alert("prod creado " + producto);
  //     return true; // Indicar que la creación fue exitosa
  //   } catch (error) {
  //     alert("error "  + error);
  //     console.error('Error al crear el producto: ', error);
  //     return false; // Indicar que hubo un error en la creación
  //   }
  // }

  crearProducto(producto: Producto, tipo:string) :Promise<void>{
    return new Promise((resolve, reject) => {
      const productos = doc(this.allProductos);
      setDoc(productos, {
        id: productos.id,
        tipo: tipo,
      ...producto // Spread operator para agregar las propiedadesrepartidor al objeto
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
        .catch((error) => {
          reject(error); // Se rechaza la promesa si ocurre un error durante la operación
        });
    });
  }


  async obtenerTodosLosProductos() {
    const productosRef = collection(this.firestore, 'productos');
    const querySnapshot = await getDocs(productosRef);

    const productos:any = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });

    return productos;
  }




}
