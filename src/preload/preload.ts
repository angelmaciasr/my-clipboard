import { contextBridge, ipcRenderer } from 'electron';
import { ClipboardItem, IpcChannel } from '../shared/types/clipboard';

// Exponer API segura al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Recibir actualizaciones del clipboard
  onClipboardUpdate: (callback: (items: ClipboardItem[]) => void) => {
    const handler = (_event: any, items: ClipboardItem[]) => callback(items);
    ipcRenderer.on(IpcChannel.CLIPBOARD_UPDATED, handler);
    return () => ipcRenderer.removeListener(IpcChannel.CLIPBOARD_UPDATED, handler);
  },

  // Obtener todos los items
  getAllItems: (): Promise<ClipboardItem[]> => {
    return ipcRenderer.invoke(IpcChannel.GET_ALL_ITEMS);
  },

  // Copiar al clipboard
  copyToClipboard: (content: string) => {
    ipcRenderer.send(IpcChannel.COPY_TO_CLIPBOARD, content);
  },

  // Eliminar item
  deleteItem: (itemId: string) => {
    ipcRenderer.send(IpcChannel.DELETE_ITEM, itemId);
  },

  // Limpiar todo
  clearAll: () => {
    ipcRenderer.send(IpcChannel.CLEAR_ALL);
  },

  // Limpiar los más antiguos
  clearOldest: (count: number) => {
    ipcRenderer.send(IpcChannel.CLEAR_OLDEST, count);
  },

  // Ocultar ventana
  hideWindow: () => {
    ipcRenderer.send(IpcChannel.HIDE_WINDOW);
  },

  // Toggle ventana
  toggleWindow: () => {
    ipcRenderer.send(IpcChannel.TOGGLE_WINDOW);
  },

  // Minimizar ventana
  minimizeWindow: () => {
    ipcRenderer.send(IpcChannel.MINIMIZE_WINDOW);
  },

  // Toggle maximizar ventana
  toggleMaximize: () => {
    ipcRenderer.send(IpcChannel.TOGGLE_MAXIMIZE);
  },
});

// Tipos para TypeScript
export interface ElectronAPI {
  onClipboardUpdate: (callback: (items: ClipboardItem[]) => void) => () => void;
  getAllItems: () => Promise<ClipboardItem[]>;
  copyToClipboard: (content: string) => void;
  deleteItem: (itemId: string) => void;
  clearAll: () => void;
  clearOldest: (count: number) => void;
  hideWindow: () => void;
  toggleWindow: () => void;
  minimizeWindow: () => void;
  toggleMaximize: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
