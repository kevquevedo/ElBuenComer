import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  allPedidos: CollectionReference<DocumentData> = collection(this.firestore, 'pedidos');
  pedidos!: Observable<any[]>;

  constructor(
    private firestore: Firestore,
  ) {
    this.pedidos = collectionData(this.allPedidos);
  }

  crearPedido(pedido: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const pedidos = doc(this.allPedidos);
      setDoc(pedidos, {
        id: pedidos.id,
        ...pedido // Spread operator para agregar las propiedadesrepartidor al objeto
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
    });
  }


  async obtenerTodosLosPedidos() {
    const pedidosRef = collection(this.firestore, 'pedidos');
    const querySnapshot = await getDocs(pedidosRef);


    const pedidos: any = [];
    querySnapshot.forEach((doc) => {
      pedidos.push({ id: doc.id, ...doc.data() });
    });


    return pedidos;
  }

  updateEstadoPedido(pedido: any) {
    const pedidosRef = doc(this.firestore, 'pedidos', pedido.id);
    updateDoc(pedidosRef, {
      estado: pedido.estado
    });
  
  }

  async obtenerPedidoPorIdUsuario(idUsuario: any) {
    const pedidosRef = collection(this.firestore, 'pedidos');
    const querySnapshot = await getDocs(query(pedidosRef, where('usuario.id', '==', idUsuario)));

    // Verificar si se encontraron resultados
    if (!querySnapshot.empty) {
      // Obtener el primer documento encontrado
      const primerPedido = querySnapshot.docs[0];

      // Acceder a los datos del documento
      const datosPedido = primerPedido.data();
      return datosPedido;
    }
    return null;
  }

  async obtenerPedidoPorId(id: any) {
    const pedidosRef = collection(this.firestore, 'pedidos');
    const querySnapshot = await getDocs(query(pedidosRef, where('id', '==', id)));

    // Verificar si se encontraron resultados
    if (!querySnapshot.empty) {
      // Obtener el primer documento encontrado
      const primerPedido = querySnapshot.docs[0];

      // Acceder a los datos del documento
      const datosPedido = primerPedido.data();
      return datosPedido;
    }
    return null;
  }


}
