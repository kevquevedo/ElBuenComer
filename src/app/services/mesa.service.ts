import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
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
      let numeroMasAlto = await this.obtenerNumeroMesaMasAlto();
      let numeroMesa = (parseInt(numeroMasAlto, 10) + 1).toString();
      mesa.numero = numeroMesa.toString();


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

  async obtenerNumeroMesaMasAlto(): Promise<string> {
    const mesasRef = collection(this.firestore, 'mesas');
    const querySnapshot = await getDocs(mesasRef);
    let numeroMasAlto = "";
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

  obtenerChatsMesasTiempoReal(): Observable<any[]> {
    const chatsRef = collection(this.firestore, 'chats-mesas');
    console.log(chatsRef)
    return new Observable<any[]>(observer => {
      const unsubscribe = onSnapshot(chatsRef, snapshot => {
        const chatsData = snapshot.docs.map(doc => doc.data());
        observer.next(chatsData);
      });

      // Esto asegura que nos desuscribamos cuando el observable es destruido
      return () => unsubscribe();
    });
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
