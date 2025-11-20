import React from 'react';
import { ClipboardItem } from '../../shared/types/clipboard';

interface ClipboardItemProps {
  item: ClipboardItem;
  onClick: () => void;
  onDelete: () => void;
  searchQuery: string;
}

const ClipboardItemComponent: React.FC<ClipboardItemProps> = ({
  item,
  onClick,
  onDelete,
  searchQuery,
}) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query || !text) return text;

    try {
      // Escapar caracteres especiales de regex
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));

      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-app-accent/30 text-app-accent">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch (error) {
      console.error('✗ Error in highlightText:', error);
      return text;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="clipboard-item group relative w-[95%]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      {item.type === 'text' ? (
        <div className="pr-8">
          <div className="text-sm text-app-text whitespace-pre-wrap break-words line-clamp-3">
            {highlightText(item.preview || item.content, searchQuery)}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-app-text-muted">{formatDate(item.timestamp)}</span>
            <span className="text-xs text-app-text-muted">
              {item.content.length} caracteres
            </span>
          </div>
        </div>
      ) : (
        <div className="pr-8">
          <div className="flex items-start space-x-3">
            <img
              src={item.content}
              alt="Clipboard image"
              className="max-w-full max-h-32 rounded border border-app-border object-contain"
            />
          </div>

          <div className="mt-2">
            <span className="text-xs text-app-text-muted">{formatDate(item.timestamp)}</span>
          </div>
        </div>
      )}

      {/* Botón de eliminar */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 bg-app-bg border border-app-border rounded-md hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
        title="Eliminar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default ClipboardItemComponent;
