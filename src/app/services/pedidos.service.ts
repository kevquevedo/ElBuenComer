import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  allPedidos: CollectionReference<DocumentData> = collection(this.firestore, 'pedidos');
  pedidos!: Observable<any[]>;

  constructor(
    private firestore:Firestore,
  ) {
    this.pedidos = collectionData(this.allPedidos);
  }

  crearPedido( pedido: any ) :Promise<void>{
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

}
