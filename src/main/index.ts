import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage } from 'electron';
import * as path from 'path';
import { ClipboardMonitor } from './clipboard-monitor';
import { StorageService } from './storage-service';
import { IpcChannel } from '../shared/types/clipboard';
import { logger } from './logger';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let clipboardMonitor: ClipboardMonitor | null = null;
let storageService: StorageService | null = null;

// Asegurar que solo haya una instancia de la aplicación
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Si ya hay una instancia corriendo, cerrar esta nueva instancia
  console.log('Ya hay una instancia de la aplicación corriendo. Cerrando esta instancia.');
  app.quit();
} else {
  // Si alguien intenta abrir una segunda instancia, mostrar la ventana existente
  app.on('second-instance', () => {
    console.log('Se intentó abrir una segunda instancia. Mostrando la ventana existente.');
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    show: false,// No mostrar al inicio
    frame: false, // Sin barra de título
    resizable: true, // Permitir redimensionar
    skipTaskbar: false, // No aparecer en la barra de tareas
    alwaysOnTop: false,
    transparent: true,
    backgroundColor: '#00000000', // Fondo transparente
    icon: path.join(__dirname, '../../assets/icon.png'), // Ícono de la ventana
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  // Cargar el HTML del renderer
  const rendererPath = path.join(__dirname, '../renderer/index.html');
  mainWindow.loadFile(rendererPath);

  // Abrir DevTools en modo desarrollo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Ocultar ventana al perder foco
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray(): void {
  // Usar el ícono desde archivo
  const icon = nativeImage.createFromPath(path.join(__dirname, '../../assets/icon.png'));

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar Clipboard',
      click: () => {
        toggleWindow();
      },
    },
    {
      label: 'Salir',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('My Clipboard Manager');
  tray.setContextMenu(contextMenu);

  // Click en el tray abre/cierra la ventana
  tray.on('click', () => {
    toggleWindow();
  });
}

function toggleWindow(): void {
  if (!mainWindow) return;

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    // Posicionar la ventana cerca del cursor (o centro de pantalla)
    const { screen } = require('electron');
    const cursorPosition = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursorPosition);

    const windowBounds = mainWindow.getBounds();
    const x = Math.round(display.bounds.x + (display.bounds.width - windowBounds.width) / 2);
    const y = Math.round(display.bounds.y + (display.bounds.height - windowBounds.height) / 2);

    mainWindow.setPosition(x, y);
    mainWindow.show();
    mainWindow.focus();
  }
}

function registerShortcuts(): void {
  // Desregistrar primero si ya existe
  if (globalShortcut.isRegistered('CommandOrControl+Alt+L')) {
    globalShortcut.unregister('CommandOrControl+Alt+L');
  }

  // Atajo global Ctrl+Alt+L
  const ret = globalShortcut.register('CommandOrControl+Alt+L', () => {
    toggleWindow();
  });

  if (!ret) {
    console.log('❌ Error: No se pudo registrar el atajo Ctrl+Alt+L (puede estar en uso por otra aplicación)');
  } else {
    console.log('✅ Atajo registrado exitosamente: Ctrl+Alt+L');
  }
}

// Configurar IPC handlers
function setupIpcHandlers(): void {
  ipcMain.on(IpcChannel.HIDE_WINDOW, () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  ipcMain.on(IpcChannel.TOGGLE_WINDOW, () => {
    toggleWindow();
  });

  ipcMain.on(IpcChannel.MINIMIZE_WINDOW, () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.on(IpcChannel.TOGGLE_MAXIMIZE, () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle(IpcChannel.GET_ALL_ITEMS, async () => {
    if (storageService) {
      return storageService.getAllItems();
    }
    return [];
  });

  ipcMain.on(IpcChannel.COPY_TO_CLIPBOARD, async (_event, content: string) => {
    const { clipboard } = require('electron');
    const { exec } = require('child_process');

    clipboard.writeText(content);

    // Ocultar ventana
    if (mainWindow) {
      mainWindow.hide();
    }

    // Esperar un momento para que la ventana se oculte
    await new Promise(resolve => setTimeout(resolve, 150));

    // Simular Ctrl+V para pegar automáticamente y asegurar que se liberen los modificadores
    exec('xdotool key --clearmodifiers ctrl+v && xdotool keyup Control_L Control_R Alt_L Alt_R', (error: any) => {
      if (error) {
        console.log('xdotool no disponible, usando método alternativo');
        // Alternativa: usar xte si está disponible
        exec('xte "keydown Control_L" "key v" "keyup Control_L"', (error2: any) => {
          if (error2) {
            console.log('No se pudo simular el pegado automático');
          }
        });
      }
      // Esperar más tiempo antes de re-registrar para asegurar que xdotool terminó
      setTimeout(() => {
        console.log('🔄 Re-registrando atajo después del pegado...');
        registerShortcuts();
      }, 500);
    });
  });

  ipcMain.on(IpcChannel.DELETE_ITEM, (_event, itemId: string) => {
    if (storageService) {
      storageService.deleteItem(itemId);
      // Notificar al renderer
      if (mainWindow) {
        mainWindow.webContents.send(IpcChannel.CLIPBOARD_UPDATED, storageService.getAllItems());
      }
    }
  });

  ipcMain.on(IpcChannel.CLEAR_ALL, () => {
    logger.log('CLEAR_ALL received from renderer');
    try {
      if (storageService) {
        logger.log('Calling storageService.clearAll()');
        storageService.clearAll();
        logger.log('✓ Clipboard history cleared successfully');

        // Usar setImmediate para asegurar que el storage se escribe antes de notificar
        setImmediate(() => {
          logger.log('Sending CLIPBOARD_UPDATED event with empty array');
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send(IpcChannel.CLIPBOARD_UPDATED, []);
            logger.log('✓ CLIPBOARD_UPDATED event sent');
          } else {
            logger.warn('mainWindow is destroyed or null');
          }
        });
      } else {
        logger.warn('storageService is null');
      }
    } catch (error) {
      logger.error('Error in CLEAR_ALL handler', error);
    }
  });

  ipcMain.on(IpcChannel.CLEAR_OLDEST, (_event, count: number) => {
    logger.log(`CLEAR_OLDEST received from renderer, count: ${count}`);
    try {
      if (storageService) {
        logger.log(`Calling storageService.clearOldest(${count})`);
        storageService.clearOldest(count);
        logger.log('✓ Oldest items cleared successfully');

        // Usar setImmediate para asegurar que el storage se escribe antes de notificar
        setImmediate(() => {
          logger.log('Sending CLIPBOARD_UPDATED event with updated items');
          if (mainWindow && !mainWindow.isDestroyed() && storageService) {
            mainWindow.webContents.send(IpcChannel.CLIPBOARD_UPDATED, storageService.getAllItems());
            logger.log('✓ CLIPBOARD_UPDATED event sent');
          } else {
            logger.warn('mainWindow is destroyed or null');
          }
        });
      } else {
        logger.warn('storageService is null');
      }
    } catch (error) {
      logger.error('Error in CLEAR_OLDEST handler', error);
    }
  });

  ipcMain.on(IpcChannel.UPDATE_LAST_USED, (_event, itemId: string) => {
    logger.log(`UPDATE_LAST_USED received from renderer, itemId: ${itemId}`);
    try {
      if (storageService) {
        logger.log(`Calling storageService.updateLastUsed(${itemId})`);
        storageService.updateLastUsed(itemId);
        logger.log('✓ lastUsed updated successfully');

        // Notificar al renderer con los items actualizados
        setImmediate(() => {
          logger.log('Sending CLIPBOARD_UPDATED event with updated items');
          if (mainWindow && !mainWindow.isDestroyed() && storageService) {
            mainWindow.webContents.send(IpcChannel.CLIPBOARD_UPDATED, storageService.getAllItems());
            logger.log('✓ CLIPBOARD_UPDATED event sent');
          } else {
            logger.warn('mainWindow is destroyed or null');
          }
        });
      } else {
        logger.warn('storageService is null');
      }
    } catch (error) {
      logger.error('Error in UPDATE_LAST_USED handler', error);
    }
  });
}

// Evento: Electron está listo
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerShortcuts();
  setupIpcHandlers();

  // Inicializar servicios
  storageService = new StorageService();
  clipboardMonitor = new ClipboardMonitor((item) => {
    if (storageService) {
      storageService.addItem(item);
      // Notificar al renderer
      if (mainWindow) {
        mainWindow.webContents.send(IpcChannel.CLIPBOARD_UPDATED, storageService.getAllItems());
      }
    }
  });

  clipboardMonitor.start();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Evento: Todas las ventanas cerradas
app.on('window-all-closed', () => {
  // En macOS es común que las apps sigan corriendo sin ventanas
  // pero para este clipboard manager queremos que siga en background
  // No llamamos app.quit() aquí
});

// Evento: Antes de salir
app.on('will-quit', () => {
  // Limpiar atajos globales
  globalShortcut.unregisterAll();

  // Detener monitoreo del clipboard
  if (clipboardMonitor) {
    clipboardMonitor.stop();
  }
});

// Prevenir que la app se cierre accidentalmente
app.on('before-quit', (event) => {
  // Aquí podrías preguntar al usuario si realmente quiere salir
});
