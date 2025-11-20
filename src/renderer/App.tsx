import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardItem } from '../shared/types/clipboard';
import SearchBar from './components/SearchBar';
import ClipboardList from './components/ClipboardList';
import Header from './components/Header';
import { logger } from './logger';

const App: React.FC = () => {
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClipboardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtrar items basándose en la búsqueda
  const filterItems = useCallback((itemsToFilter: ClipboardItem[], query: string): ClipboardItem[] => {
    if (!query) {
      return itemsToFilter;
    }

    const lowerQuery = query.toLowerCase();

    return itemsToFilter.filter((item) => {
      if (item.type === 'text') {
        return item.content.toLowerCase().includes(lowerQuery);
      }
      return false;
    });
  }, []);

  // Cargar items y registrar listener (una sola vez)
  useEffect(() => {
    logger.log('App mounted, loading initial items');
    const loadItems = async () => {
      try {
        const allItems = await window.electronAPI.getAllItems();
        logger.log('✓ Items cargados:', allItems.length);
        setItems(allItems);
      } catch (error) {
        logger.error('✗ Error cargando items:', error);
      }
    };

    loadItems();

    // Escuchar actualizaciones del clipboard (se registra una sola vez)
    logger.log('Registering onClipboardUpdate listener');
    const unsubscribe = window.electronAPI.onClipboardUpdate((updatedItems) => {
      try {
        logger.log('✓ onClipboardUpdate triggered, items:', updatedItems.length);
        logger.debug('Updated items data:', updatedItems);

        if (!Array.isArray(updatedItems)) {
          logger.error('✗ updatedItems is not an array!', { type: typeof updatedItems, value: updatedItems });
          setItems([]);
        } else {
          logger.log('Setting items to', updatedItems.length);
          setItems(updatedItems);
          logger.log('✓ Items set successfully');
        }
      } catch (error) {
        logger.error('✗ Error actualizando clipboard:', error);
        logger.dumpLogs();
      }
    });

    return () => {
      logger.log('App cleanup, unsubscribing from clipboard updates');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Aplicar filtro cuando items o searchQuery cambian
  useEffect(() => {
    const filtered = filterItems(items, searchQuery);
    setFilteredItems(filtered);
  }, [items, searchQuery, filterItems]);

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Manejar clic en un item (copiar al clipboard)
  const handleItemClick = useCallback((item: ClipboardItem) => {
    window.electronAPI.copyToClipboard(item.content);
  }, []);

  // Manejar eliminación de un item
  const handleDeleteItem = useCallback((itemId: string) => {
    window.electronAPI.deleteItem(itemId);
  }, []);


  // Manejar tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.electronAPI.hideWindow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-app-bg text-app-text rounded-xl shadow-lg">
      <Header itemCount={items.length} />

      <div className="p-4">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4 m-3 rounded-lg">
        <ClipboardList
          items={filteredItems}
          onItemClick={handleItemClick}
          onDeleteItem={handleDeleteItem}
          searchQuery={searchQuery}
        />
      </div>

      <div className="px-4 py-2 text-center text-xs text-app-text-muted border-t border-app-border">
        <p>
          <kbd className="px-2 py-1 bg-app-surface rounded">Ctrl+Shift+V</kbd> para abrir
          {' · '}
          <kbd className="px-2 py-1 bg-app-surface rounded">Esc</kbd> para cerrar
        </p>
      </div>
    </div>
  );
};

export default App;
