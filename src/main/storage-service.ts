import Store from 'electron-store';
import { ClipboardItem } from '../shared/types/clipboard';

interface StoreSchema {
  clipboardItems: ClipboardItem[];
  maxItems: number;
}

export class StorageService {
  private store: Store<StoreSchema>;
  private readonly MAX_ITEMS = 500; // Límite de items en el historial

  constructor() {
    this.store = new Store<StoreSchema>({
      name: 'clipboard-data',
      defaults: {
        clipboardItems: [],
        maxItems: this.MAX_ITEMS,
      },
    });
  }

  /**
   * Añadir un nuevo item al historial
   */
  addItem(item: ClipboardItem): void {
    const items = this.getAllItems();

    // Verificar si ya existe un item idéntico (evitar duplicados consecutivos)
    if (items.length > 0) {
      const lastItem = items[0];

      if (this.areItemsEqual(lastItem, item)) {
        console.log('Item duplicado, ignorando...');
        return;
      }
    }

    // Añadir al principio de la lista (más reciente primero)
    items.unshift(item);

    // Limitar el número de items
    if (items.length > this.MAX_ITEMS) {
      items.splice(this.MAX_ITEMS);
    }

    this.store.set('clipboardItems', items);
  }

  /**
   * Obtener todos los items del historial
   */
  getAllItems(): ClipboardItem[] {
    return this.store.get('clipboardItems', []);
  }

  /**
   * Eliminar un item específico
   */
  deleteItem(itemId: string): void {
    const items = this.getAllItems();
    const filteredItems = items.filter((item) => item.id !== itemId);
    this.store.set('clipboardItems', filteredItems);
  }

  /**
   * Limpiar todo el historial
   */
  clearAll(): void {
    try {
      // Usar delete para asegurarse de que se limpia completamente
      this.store.delete('clipboardItems');
      // Reinicializar con un array vacío
      this.store.set('clipboardItems', []);
      console.log('✓ clearAll: clipboardItems cleared');
    } catch (error) {
      alert('ERROR: ' + error);
      console.error('✗ Error in clearAll:', error);
      throw error;
    }
  }

  /**
   * Obtener item por ID
   */
  getItemById(itemId: string): ClipboardItem | undefined {
    const items = this.getAllItems();
    return items.find((item) => item.id === itemId);
  }

  /**
   * Buscar items por texto
   */
  searchItems(query: string): ClipboardItem[] {
    const items = this.getAllItems();

    if (!query) {
      return items;
    }

    const lowerQuery = query.toLowerCase();

    return items.filter((item) => {
      if (item.type === 'text') {
        return item.content.toLowerCase().includes(lowerQuery);
      }
      return false;
    });
  }

  /**
   * Verificar si dos items son iguales
   */
  private areItemsEqual(item1: ClipboardItem, item2: ClipboardItem): boolean {
    if (item1.type !== item2.type) {
      return false;
    }

    // Para texto, comparar contenido
    if (item1.type === 'text') {
      return item1.content === item2.content;
    }

    // Para imágenes, comparar data URL (esto puede ser costoso, pero es necesario)
    if (item1.type === 'image') {
      return item1.content === item2.content;
    }

    return false;
  }

  /**
   * Obtener configuración de límite de items
   */
  getMaxItems(): number {
    return this.store.get('maxItems', this.MAX_ITEMS);
  }

  /**
   * Actualizar configuración de límite de items
   */
  setMaxItems(max: number): void {
    this.store.set('maxItems', max);

    // Recortar lista si es necesario
    const items = this.getAllItems();
    if (items.length > max) {
      items.splice(max);
      this.store.set('clipboardItems', items);
    }
  }
}
