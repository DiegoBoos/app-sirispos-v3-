import { Injectable, computed, signal } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db: IDBPDatabase | null = null;
  private readonly dbName = 'localSirisPOSv3DB';
  private readonly pedido = 'separation';

  private _execTransaction = signal<boolean>(false);
  public execTransaction = computed(() => this._execTransaction());

  constructor() {}

  private async getDb(): Promise<IDBPDatabase> {
    if (this.db) {
      return this.db;
    }

    this.db = await openDB(this.dbName, 1, {
      upgrade(database) {
        database.createObjectStore('separation', {
          keyPath: 'id',
          autoIncrement: true,
        });
      },
    });

    return this.db;
  }

  async getPedido(pedidoId: number): Promise<any> {
    await this.getDb();
    if (!this.db) return null;
    const tx = this.db.transaction(this.pedido, 'readonly');
    const store = tx.objectStore(this.pedido);
    return await store.get(pedidoId);
  }

  async savePedido(objeto: any): Promise<IDBValidKey> {
    if (!this.db) return -1;
    this._execTransaction.set(false);

    const tx = this.db.transaction(this.pedido, 'readwrite');
    const store = tx.objectStore(this.pedido);
    const existPedido =  await store.getKey(objeto.pedidoId);

    if (existPedido) {
      objeto.id = objeto.pedidoId;
      // Objeto ya existe, actualiza en lugar de insertar
      await store.put(objeto);
    } else {
      // Objeto no existe, inserta
      // const { ...restObj } = objeto;
      objeto.id = objeto.pedidoId;
      console.log(objeto);
      
      await store.add(objeto);
    }

    this._execTransaction.set(true);
    await tx.done;
    return objeto.id;
  }

  async removePedido(id: number) {
    if (!this.db) return;
    this._execTransaction.set(false);
    const tx = this.db.transaction(this.pedido, 'readwrite');
    const store = tx.objectStore(this.pedido);
    await store.delete(id);
    this._execTransaction.set(true);
    await tx.done;
}
}
