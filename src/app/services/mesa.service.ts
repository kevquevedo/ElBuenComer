import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, getDocs, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mesa } from '../clases/mesa';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  allMesas: CollectionReference<DocumentData> = collection(this.firestore, 'mesas');
  mesas!: Observable<any[]>;

  constructor(
    private firestore: Firestore,
  ) {
    this.mesas = collectionData(this.allMesas);
  }

  // crearMesa(mesa: Mesa) :Promise<void>{
  //   return new Promise((resolve, reject) => {
  //     const mesas = doc(this.allMesas);
  //     setDoc(mesas, {
  //       id: mesas.id,
  //     ...mesa // Spread operator para agregar las propiedadesrepartidor al objeto
  //     })
  //       .then(() => {
  //         resolve(); // Se resuelve la promesa si la operación se completa correctamente
  //       })
  //       .catch((error) => {
  //         reject(error); // Se rechaza la promesa si ocurre un error durante la operación
  //       });
  //   });
  // }

  async crearMesa(mesa: Mesa) : Promise<void> {
    try {
      const numeroMasAlto = await this.obtenerNumeroMesaMasAlto();
      alert(numeroMasAlto);
      mesa.numero = numeroMasAlto + 1;


      const mesas = doc(this.allMesas);
      await setDoc(mesas, {
        id: mesas.id,
        ...mesa
      });
    } catch (error) {
      console.error('Error al crear la mesa: ', error);
      throw error;
    }
  }


  async obtenerTodosLosMesas() {
    const mesasRef = collection(this.firestore, 'mesas');
    const querySnapshot = await getDocs(mesasRef);


    const mesas:any = [];
    querySnapshot.forEach((doc) => {
      mesas.push({ id: doc.id, ...doc.data() });
    });


    return mesas;
  }

  async obtenerNumeroMesaMasAlto(): Promise<number> {
    const mesasRef = collection(this.firestore, 'mesas');
    const querySnapshot = await getDocs(mesasRef);
    let numeroMasAlto = 0;
    querySnapshot.forEach((doc) => {
      const mesa = doc.data();
      if (mesa['numero'] > numeroMasAlto) {
        numeroMasAlto = mesa['numero'];
      }
    });
    return numeroMasAlto;
  }

  obtenerChatsMesas(){
    const chatmesas = collection(this.firestore, 'chats-mesas');
    return getDocs(chatmesas);
  }

  updateChatsMesas(mensajes:any, idMesa: any){
    const chatMesasRef = doc(this.firestore, 'chats-mesas', idMesa);
    updateDoc(chatMesasRef, {
      mensajes: mensajes
    });
  }

  updateMesaOcupada(mesa: any, estado:boolean){
    const mesasRef = doc(this.firestore, 'mesas', mesa.id);
    updateDoc(mesasRef, {
      ocupada: estado
    });
  }

  updateMesaOcupadaById(mesaID: any, estado:boolean){
    const mesasRef = doc(this.firestore, 'mesas', mesaID);
    updateDoc(mesasRef, {
      ocupada: estado
    });
  }

}
