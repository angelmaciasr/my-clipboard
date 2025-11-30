export interface ClipboardItem {
  id: string;
  type: 'text' | 'image';
  content: string; // Para texto: el texto; Para imagen: base64 data URL
  timestamp: number;
  preview?: string; // Preview truncado para texto largo
  lastUsed?: number; // Timestamp de la última vez que se usó (pegó) el elemento
}

export interface ClipboardData {
  items: ClipboardItem[];
}

// IPC Channels
export enum IpcChannel {
  // Main -> Renderer
  CLIPBOARD_UPDATED = 'clipboard:updated',

  // Renderer -> Main
  COPY_TO_CLIPBOARD = 'clipboard:copy',
  DELETE_ITEM = 'clipboard:delete',
  CLEAR_ALL = 'clipboard:clear-all',
  CLEAR_OLDEST = 'clipboard:clear-oldest',
  GET_ALL_ITEMS = 'clipboard:get-all',
  UPDATE_LAST_USED = 'clipboard:update-last-used',

  // Bidireccional
  TOGGLE_WINDOW = 'window:toggle',
  HIDE_WINDOW = 'window:hide',
  MINIMIZE_WINDOW = 'window:minimize',
  TOGGLE_MAXIMIZE = 'window:toggle-maximize',
}
