import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

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
    updateDoc(pedidosRef, pedido);

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

  obtenerPedidoPorIdTiempoReal(id: any): Observable<any> {
    const pedidoRef = doc(this.firestore, 'pedidos', id);
  
    return new Observable<any>(observer => {
      const unsubscribe = onSnapshot(pedidoRef, docSnapshot => {
        if (docSnapshot.exists()) {
          const datosPedido = docSnapshot.data();
          observer.next(datosPedido);
        } else {
          observer.next(null);
        }
      });
  
      // Esto asegura que nos desuscribamos cuando el observable es destruido
      return () => unsubscribe();
    });
  }

  obtenerPedidos(){
    const pedidos = collection(this.firestore, 'pedidos');
    return getDocs(pedidos);
  }

  obtenerPedidosEnTiempoReal(): Observable<any[]> {
    const pedidos = collection(this.firestore, 'pedidos');
  
    return new Observable<any[]>(observer => {
      const unsubscribe = onSnapshot(pedidos, snapshot => {
        const pedidosData = snapshot.docs.map(doc => doc.data());
        observer.next(pedidosData);
      });
  
      // Esto asegura que nos desuscribamos cuando el observable es destruido
      return () => unsubscribe();
    });
  }

  obtenerPedidoPorIdUsuarioTiempoReal(idUsuario: any): Observable<DocumentData | null> {
    const pedidosRef = collection(this.firestore, 'pedidos');
    const querySnapshot = query(pedidosRef, where('usuario.id', '==', idUsuario));

    // Obtener la primera respuesta y crear un observable
    return new Observable(observer => {
      const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
        if (!snapshot.empty) {
          const primerPedido = snapshot.docs[0];
          const datosPedido = primerPedido.data();
          observer.next(datosPedido);
        } else {
          observer.next(null);
        }
      });

      // Devolver una función de limpieza para cancelar la suscripción
      return () => unsubscribe();
    });
  }

  async actualizarEstadoEncuesta(idPedido:any, encuesta: boolean): Promise<void> {
    const aux = doc(this.firestore, `pedidos/${idPedido}`);
    await updateDoc(aux, {
      encuesta: encuesta
    })
  }

}
