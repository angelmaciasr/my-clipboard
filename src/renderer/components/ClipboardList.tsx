import React, { useEffect } from 'react';
import { ClipboardItem } from '../../shared/types/clipboard';
import ClipboardItemComponent from './ClipboardItemComponent';

interface ClipboardListProps {
  items: ClipboardItem[];
  onItemClick: (item: ClipboardItem) => void;
  onDeleteItem: (itemId: string) => void;
  searchQuery: string;
}

const ClipboardList: React.FC<ClipboardListProps> = ({
  items,
  onItemClick,
  onDeleteItem,
  searchQuery,
}) => {


  if (items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-app-text-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg">
            {searchQuery ? 'No se encontraron resultados' : 'No hay elementos en el historial'}
          </p>
          <p className="text-sm mt-2">
            {searchQuery
              ? 'Intenta con otra búsqueda'
              : 'Copia algo para comenzar a guardar el historial'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-2 flex flex-col">
      {items.map((item) => (
        <div key={item.id} className="w-full flex justify-center">
          <ClipboardItemComponent
            item={item}
            onClick={() => onItemClick(item)}
            onDelete={() => onDeleteItem(item.id)}
            searchQuery={searchQuery}
          />
        </div>
      ))}
    </div>
  );
};

export default ClipboardList;
