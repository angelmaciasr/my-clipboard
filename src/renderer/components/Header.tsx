import React, { useCallback, useState } from 'react';
import { logger } from '../logger';

interface HeaderProps {
  itemCount: number;
}

const Header = (props : HeaderProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Manejar botones de ventana estilo macOS
    const handleClose = useCallback(() => {
      logger.log('handleClose clicked');
      window.electronAPI.hideWindow();
    }, []);

    const handleMinimize = useCallback(() => {
      logger.log('handleMinimize clicked');
      window.electronAPI.minimizeWindow();
    }, []);

    const handleMaximize = useCallback(() => {
      logger.log('handleMaximize clicked');
      window.electronAPI.toggleMaximize();
    }, []);

     // Manejar limpiar todo
      const handleClearAll = useCallback(() => {
        logger.log('handleClearAll clicked, showing confirm dialog');
        setShowConfirmDialog(true);
      }, []);

      const confirmClearAll = useCallback(() => {
        logger.log('confirmClearAll confirmed, calling electronAPI.clearAll()');
        setShowConfirmDialog(false);
        try {
          window.electronAPI.clearAll();
          logger.log('✓ clearAll() called successfully');
        } catch (error) {
          logger.error('✗ Error calling clearAll():', error);
        }
      }, []);

      const cancelClearAll = useCallback(() => {
        logger.log('cancelClearAll clicked');
        setShowConfirmDialog(false);
      }, []);


  return (
    <>
      <div className="bg-gray-800 flex items-center justify-between h-8 px-3 border-b border-gray-700  draggable-area">
          <div className="flex gap-2">
            {/* Botón rojo - Cerrar */}
            <button
              onClick={handleClose}
              className="w-[13px] h-[13px] rounded-full bg-red-400 hover:bg-red-600 flex items-center justify-center group transition-colors"
              title="Cerrar"
            >
              <span className="opacity-0 group-hover:opacity-100 text-black font-bold">×</span>
            </button>

            {/* Botón amarillo - Minimizar */}
            <button
              onClick={handleMinimize}
              className="w-[13px] h-[13px] rounded-full bg-yellow-400 hover:bg-yellow-600 flex items-center justify-center group transition-colors"
              title="Minimizar"
            >
              <span className="opacity-0 group-hover:opacity-100 text-black font-bold">−</span>
            </button>

            {/* Botón verde - Pantalla completa */}
            <button
              onClick={handleMaximize}
              className="w-[13px] h-[13px] rounded-full bg-green-400 hover:bg-green-600 flex items-center justify-center group transition-colors"
              title="Pantalla completa"
            >
              <span className="opacity-0 group-hover:opacity-100  text-black font-bold">⤢</span>
            </button>
          </div>

          <div className="text-center text-sm text-app-text">
            Clipboard Manager - {props.itemCount} {props.itemCount === 1 ? 'item' : 'items'}
          </div>

          <div className='text-center text-sm text-app-text'>
            <button className='bg-red-600 text-app-text rounded px-2 py-1 m-1' onClick={handleClearAll}>Limpiar</button>
          </div>
        </div>

      {/* Diálogo de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-app-text mb-4">
              ¿Borrar todo el historial?
            </h2>
            <p className="text-app-text-muted mb-6">
              Esta acción no se puede deshacer. Se eliminarán todos los elementos del historial del portapapeles.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelClearAll}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-app-text transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmClearAll}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
