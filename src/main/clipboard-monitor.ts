import { clipboard, nativeImage } from 'electron';
import { ClipboardItem } from '../shared/types/clipboard';
import { v4 as uuidv4 } from 'uuid';

export class ClipboardMonitor {
  private interval: NodeJS.Timeout | null = null;
  private lastContent: string = '';
  private callback: (item: ClipboardItem) => void;
  private readonly pollInterval = 500; // Check cada 500ms

  constructor(callback: (item: ClipboardItem) => void) {
    this.callback = callback;
  }

  start(): void {
    // Inicializar con el contenido actual
    this.lastContent = clipboard.readText();

    this.interval = setInterval(() => {
      this.checkClipboard();
    }, this.pollInterval);

    console.log('Clipboard monitor started');
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Clipboard monitor stopped');
    }
  }

  private checkClipboard(): void {
    try {
      // Primero verificar si hay texto
      const text = clipboard.readText();

      if (text && text !== this.lastContent) {
        this.lastContent = text;

        const item: ClipboardItem = {
          id: uuidv4(),
          type: 'text',
          content: text,
          timestamp: Date.now(),
          preview: this.createTextPreview(text),
        };

        this.callback(item);
        return;
      }

      // Si no hay texto nuevo, verificar si hay imagen
      const image = clipboard.readImage();

      if (!image.isEmpty()) {
        const imageDataUrl = image.toDataURL();

        // Verificar si esta imagen es diferente a la última (comparando por tamaño básico)
        if (imageDataUrl !== this.lastContent) {
          this.lastContent = imageDataUrl;

          const item: ClipboardItem = {
            id: uuidv4(),
            type: 'image',
            content: imageDataUrl,
            timestamp: Date.now(),
          };

          this.callback(item);
        }
      }
    } catch (error) {
      console.error('Error checking clipboard:', error);
    }
  }

  private createTextPreview(text: string, maxLength: number = 100): string {
    // Remover saltos de línea múltiples y espacios extras
    const cleaned = text.replace(/\s+/g, ' ').trim();

    if (cleaned.length <= maxLength) {
      return cleaned;
    }

    return cleaned.substring(0, maxLength) + '...';
  }
}
