import { Injectable } from '@angular/core';
import { Producto } from '../clases/producto';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class ProductosService {

  items!: Observable<any[]>;
  productosRef: any;

  constructor(
    private firestore: Firestore,
  ) { }

  async crearProducto(producto: Producto) {
    try {
      const productosRef = collection(this.firestore, 'productos');
      const docRef = await addDoc(productosRef, producto);
      console.log('Producto creado con ID: ', docRef.id);
      return true; // Indicar que la creación fue exitosa
    } catch (error) {
      console.error('Error al crear el producto: ', error);
      return false; // Indicar que hubo un error en la creación
    }
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
