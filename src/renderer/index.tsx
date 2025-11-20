import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Error boundary para capturar errores globales
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('✗ Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-xl font-bold text-red-500 mb-4">Error en la aplicación</h1>
            <p className="text-gray-400 mb-4">{this.state.error?.message}</p>
            <pre className="bg-gray-800 p-3 rounded text-xs text-gray-300 overflow-auto max-h-48 mb-4">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Reiniciar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Agregar listeners globales para errores
window.addEventListener('error', (event) => {
  console.error('✗ Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('✗ Unhandled promise rejection:', event.reason);
});

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
